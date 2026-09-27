(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EhonContinuous = api;
})(typeof self !== 'undefined' ? self : this, () => {
  'use strict';

  // Screen-off listening, engine-wide: instead of chaining individual clips through one audio
  // element's `ended` event (see ehon.js's createNarrator), this builds the WHOLE book — every
  // page, in the reader's chosen listening mode — into a single in-memory Blob up front, with
  // short silence clips standing in for the pauses ehon.js's PAUSE_BETWEEN_LANGUAGES/SENTENCES
  // insert between clips in the sentence-by-sentence mode. One continuous <audio> element then
  // plays that whole Blob; Android Chrome keeps a single already-playing <audio> going with the
  // screen off far more reliably than it keeps re-arming playback from a `ended` handler.
  //
  // Every clip's exact duration is precomputed at build time by generate-audio-timing.js (which
  // shells out to ffprobe) into that series' own audio-timing.json, checked in like the
  // generated book pages. Nothing here re-measures durations at runtime: buildContinuousTimeline
  // is pure arithmetic over that manifest, so the page/line the reader is on can be recovered
  // from `audio.currentTime` alone (mapTimeToPage/mapTimeToLine) even after the screen was off
  // long enough that no UI update ran.

  const SILENCE_KINDS = ['language', 'sentence', 'page'];

  function silencePath(kind, base = './') {
    return `${base}silence/${kind}.mp3`;
  }

  // Every clip and gap the whole book plays through, in order, for one listening mode — built
  // from the same per-page E.pageQueue() the sentence-by-sentence reader uses, so the two modes
  // can never disagree about which clips play in which order for a given mode.
  //
  // A page with no narrated lines (the cover, the "the end" page) still gets an entry in
  // `pages` — a zero-width slot at whatever point in time it falls — so next/previous seeking
  // always has somewhere to land, even on a silent page. A leading `page` gap is inserted before
  // the very first narrated clip (not only between later pages) so that leading, zero-width
  // cover slot keeps a `startMs` distinct from the first narrated page's; without it the two
  // would tie at 0 and mapTimeToPage could never tell them apart.
  function buildContinuousTimeline(E, story, modes, defaultMode, mode, timing) {
    const segments = [];
    const lines = [];
    const pages = [];
    let time = 0;
    let pendingPageGap = true;
    const storyTiming = timing?.stories?.[story.id] || {};
    const silenceMs = timing?.silence || {};

    for (const [pageIndex, page] of story.pages.entries()) {
      const queue = E.pageQueue(page, modes, defaultMode, mode);
      const pageEntry = { startMs: time, endMs: time };
      if (queue.length) {
        if (pendingPageGap) {
          const durationMs = silenceMs.page || 0;
          segments.push({ kind: 'silence', which: 'page', startMs: time, durationMs });
          time += durationMs;
          pendingPageGap = false;
        }
        pageEntry.startMs = time;
        for (const [stepIndex, step] of queue.entries()) {
          const durationMs = storyTiming[step.lineId]?.[step.lang] || 0;
          segments.push({ kind: 'clip', page: pageIndex, lineId: step.lineId, lang: step.lang, startMs: time, durationMs });
          lines.push({ page: pageIndex, lineId: step.lineId, lang: step.lang, startMs: time, endMs: time + durationMs });
          time += durationMs;
          const next = queue[stepIndex + 1];
          if (next) {
            const which = next.lineId === step.lineId ? 'language' : 'sentence';
            const gapMs = silenceMs[which] || 0;
            segments.push({ kind: 'silence', which, startMs: time, durationMs: gapMs });
            time += gapMs;
          }
        }
        pageEntry.endMs = time;
        pendingPageGap = true;
      }
      pages.push(pageEntry);
    }
    return { segments, pages, lines, totalMs: time };
  }

  // The page a listener is on at `timeMs`: the last page whose slot has already started.
  function mapTimeToPage(pages, timeMs) {
    let index = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].startMs <= timeMs) index = i;
    }
    return index;
  }

  // The line currently sounding at `timeMs`, or null while inside a gap between two lines.
  function mapTimeToLine(lines, timeMs) {
    for (const line of lines) {
      if (timeMs >= line.startMs && timeMs < line.endMs) return line;
    }
    return null;
  }

  // Every clip carries an ID3v2 tag (see taiwan-ehon/generate_gemini_audio.py) that is only
  // meaningful at the very start of a standalone file: mid-stream, its bytes are not a valid
  // MP3 frame and can stop some decoders from resyncing. Stripped from every clip and silence
  // file before concatenation. A trailing ID3v1 tag (the last 128 bytes, "TAG...") is stripped
  // for the same reason; none of today's generated clips carry one, but a future encoder might.
  function stripId3v2(bytes) {
    if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return bytes;
    const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    return bytes.subarray(Math.min(10 + size, bytes.length));
  }

  function stripId3v1(bytes) {
    if (bytes.length < 128) return bytes;
    const tailStart = bytes.length - 128;
    if (bytes[tailStart] === 0x54 && bytes[tailStart + 1] === 0x41 && bytes[tailStart + 2] === 0x47) {
      return bytes.subarray(0, tailStart);
    }
    return bytes;
  }

  // Every clip's first MP3 frame (right after its ID3v2 tag) is a Xing/LAME VBR header: a
  // normal, self-contained, near-silent frame that a lone standalone file needs so a player can
  // estimate its overall duration/seek table. Concatenated one after another, a decoder that
  // trusts the FIRST one it sees mis-estimates the duration of (and misseeks within) the whole
  // joined stream by whatever that one clip's own bitrate/length happened to be — confirmed with
  // `ffprobe -count_frames` on an assembled test file: the actual decoded audio was correct and
  // in order, but the reported duration was roughly double the real one. So every clip's own
  // Xing/LAME frame is stripped too, leaving only real audio frames; only the very first
  // surviving frame in the whole assembled Blob ever describes anything, and it is real audio,
  // never a stale VBR header. Detected by the "Xing"/"Info" tag bytes a real audio frame never
  // contains, then skipped by scanning forward for the next frame sync rather than computing an
  // exact frame length from the MPEG bitrate table.
  function isFrameSync(bytes, index) {
    return bytes[index] === 0xff && (bytes[index + 1] & 0xe0) === 0xe0;
  }

  function stripVbrHeaderFrame(bytes) {
    if (bytes.length < 8 || !isFrameSync(bytes, 0)) return bytes;
    const searchEnd = Math.min(bytes.length, 400);
    let tagAt = -1;
    for (let i = 4; i < searchEnd - 4; i++) {
      if ((bytes[i] === 0x58 && bytes[i + 1] === 0x69 && bytes[i + 2] === 0x6e && bytes[i + 3] === 0x67) // 'Xing'
        || (bytes[i] === 0x49 && bytes[i + 1] === 0x6e && bytes[i + 2] === 0x66 && bytes[i + 3] === 0x6f)) { // 'Info'
        tagAt = i;
        break;
      }
    }
    if (tagAt === -1) return bytes; // not a VBR header frame — leave real audio alone
    for (let i = tagAt + 4; i < bytes.length - 1; i++) {
      if (isFrameSync(bytes, i)) return bytes.subarray(i);
    }
    return bytes; // no following frame found; leave the file untouched rather than guess
  }

  function stripTags(bytes) {
    return stripVbrHeaderFrame(stripId3v1(stripId3v2(bytes)));
  }

  // Builds the whole book's playback Blob in memory, one clip/silence file at a time via the
  // injected `loadBytes(segment)` (real callers fetch each clip/silence URL; tests can inject a
  // fixture). Nothing here writes the assembled Blob to any cache — it is played once via a
  // temporary object URL and left to be garbage-collected, never a second stored copy of audio
  // that is already downloaded (or downloadable) per clip.
  async function assembleContinuousBlob(timeline, loadBytes) {
    const parts = [];
    for (const segment of timeline.segments) {
      const buffer = await loadBytes(segment);
      parts.push(stripTags(new Uint8Array(buffer)));
    }
    return new Blob(parts, { type: 'audio/mpeg' });
  }

  // The real `loadBytes` used in the browser: fetches every clip once, and memoizes each of the
  // (at most three) silence files for the duration of one assembly instead of refetching them for
  // every gap in the book.
  function createByteLoader(fetchFn, base, storyId) {
    const silenceBytes = new Map();
    function readResponse(response) {
      if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
      return response.arrayBuffer();
    }
    return function loadBytes(segment) {
      if (segment.kind === 'silence') {
        if (!silenceBytes.has(segment.which)) {
          silenceBytes.set(segment.which, fetchFn(silencePath(segment.which, base)).then(readResponse));
        }
        return silenceBytes.get(segment.which);
      }
      return fetchFn(clipUrl(base, storyId, segment.lang, segment.lineId)).then(readResponse);
    };
  }

  function clipUrl(base, storyId, lang, lineId) {
    return `${base}audio/${storyId}/${lang}/${lineId}.mp3`;
  }

  // Plays one whole-book continuous Blob through `audio`, mirroring the play/pause/resume/stop
  // shape of ehon.js's createNarrator so app.js can switch between the two the same way it
  // switches between any other pair of UI states. Exactly one of narrator/this ever owns
  // `audio` at a time — see engine/app.js's readPage/readLine/goTo for how that handoff works.
  function createContinuousPlayer(audio, handlers = {}) {
    const { onTimeUpdate = () => {}, onEnded = () => {} } = handlers;
    let state = 'idle'; // 'idle' | 'loading' | 'playing' | 'paused'
    let playbackGeneration = 0;
    let objectUrl = null;
    let timeline = null;

    function releaseUrl() {
      if (objectUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }

    function detach() {
      audio.ontimeupdate = null;
      audio.onended = null;
    }

    function bindEnded(generation) {
      audio.onended = () => {
        if (generation !== playbackGeneration) return;
        playbackGeneration++;
        state = 'idle';
        onEnded();
      };
    }

    // Marks a rebuild in progress (e.g. the listening mode changed while a book was playing) so
    // a stray play-button tap doesn't restart the fetch, without touching `audio` itself — the
    // previous Blob (if any) keeps playing until the new one is ready.
    function loading() {
      playbackGeneration++;
      detach();
      releaseUrl();
      timeline = null;
      state = 'loading';
    }

    function stop() {
      playbackGeneration++;
      detach();
      releaseUrl();
      timeline = null;
      state = 'idle';
      audio.pause();
      try { audio.currentTime = 0; } catch (_error) { /* not yet loaded */ }
    }

    async function play(blob, nextTimeline, { startAtMs = 0, paused = false } = {}) {
      const generation = ++playbackGeneration;
      releaseUrl();
      timeline = nextTimeline;
      objectUrl = URL.createObjectURL(blob);
      audio.ontimeupdate = () => onTimeUpdate(Math.round(audio.currentTime * 1000));
      bindEnded(generation);
      audio.src = objectUrl;
      try { audio.currentTime = Math.max(startAtMs, 0) / 1000; } catch (_error) { /* not yet loaded */ }
      if (paused) { state = 'paused'; return true; }
      state = 'playing';
      try {
        const playback = audio.play();
        if (playback && typeof playback.then === 'function') await playback;
      } catch (_error) {
        if (generation !== playbackGeneration) return true;
        state = 'paused';
        return false;
      }
      return true;
    }

    function pause() {
      if (state !== 'playing') return false;
      playbackGeneration++;
      audio.pause();
      state = 'paused';
      return true;
    }

    function resume() {
      if (state !== 'paused') return false;
      state = 'playing';
      const generation = ++playbackGeneration;
      bindEnded(generation);
      const playback = audio.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          if (generation === playbackGeneration) state = 'idle';
        });
      }
      return true;
    }

    function seekToPage(index) {
      const page = timeline?.pages[index];
      if (!page) return false;
      try { audio.currentTime = page.startMs / 1000; } catch (_error) { return false; }
      return true;
    }

    return {
      play,
      pause,
      resume,
      stop,
      loading,
      seekToPage,
      get state() { return state; },
      get timeline() { return timeline; },
    };
  }

  return {
    SILENCE_KINDS,
    silencePath,
    buildContinuousTimeline,
    mapTimeToPage,
    mapTimeToLine,
    stripId3v2,
    stripId3v1,
    stripTags,
    assembleContinuousBlob,
    createByteLoader,
    createContinuousPlayer,
  };
});
