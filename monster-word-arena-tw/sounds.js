(() => {
  'use strict';

  // Every sound is synthesized with the Web Audio API: no files, no network, no stock samples.
  // Effects and music run on their own AudioContext, never on the shared speech <audio> element,
  // and stay well below the narration level.
  const EFFECT_LEVEL = 0.35;
  const MUSIC_LEVEL = 0.06;
  const DUCKED = { effects: 0.55, music: 0.3 };
  const MAX_VOICES = 5;
  const MIN_GAP = { tap: 0.07, sparkle: 0.25, whoosh: 0.25, boing: 0.3, giggle: 0.3, cheer: 1 };
  const EFFECTS = Object.keys(MIN_GAP);

  // A slow, soft pentatonic lullaby: 16 steps of melody over one bass note per bar.
  const STEP_SECONDS = 0.36;
  const MELODY = [659, 784, 880, 784, 659, 587, 523, 0, 587, 659, 784, 659, 587, 523, 587, 0];
  const BASS = [131, 110, 87, 98];
  const LOOKAHEAD_SECONDS = 0.6;

  function createSoundBoard(makeContext, { setTimer = setInterval, clearTimer = clearInterval } = {}) {
    let ctx = null;
    let unavailable = !makeContext;
    let master = null;
    let effectsBus = null;
    let musicBus = null;
    let noiseBuffer = null;
    let muted = false;
    let musicOn = false;
    let speaking = false;
    let musicTimer = null;
    let nextStepTime = 0;
    let step = 0;
    const lastPlayed = {};
    let voices = [];

    function context() {
      if (ctx || unavailable) return ctx;
      try {
        ctx = makeContext();
        master = ctx.createGain();
        master.gain.value = 1;
        master.connect(ctx.destination);
        effectsBus = ctx.createGain();
        effectsBus.connect(master);
        musicBus = ctx.createGain();
        musicBus.connect(master);
        applyLevels(true);
      } catch (_error) {
        ctx = null;
        unavailable = true;
      }
      return ctx;
    }

    function wake() {
      if (ctx?.state === 'suspended') ctx.resume?.()?.catch?.(() => {});
    }

    function setLevel(param, value, immediate) {
      if (immediate) {
        param.value = value;
        return;
      }
      const now = ctx.currentTime;
      param.cancelScheduledValues(now);
      param.setValueAtTime(param.value, now);
      param.linearRampToValueAtTime(value, now + 0.12);
    }

    function applyLevels(immediate = false) {
      if (!ctx) return;
      setLevel(master.gain, muted ? 0 : 1, immediate);
      setLevel(effectsBus.gain, EFFECT_LEVEL * (speaking ? DUCKED.effects : 1), immediate);
      setLevel(musicBus.gain, musicOn ? MUSIC_LEVEL * (speaking ? DUCKED.music : 1) : 0, immediate);
    }

    function tone(out, { type = 'sine', from, to = from, start, length, peak = 0.4, attack = 0.012 }) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, start);
      if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + length);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + length + 0.02);
      return osc;
    }

    function noise(out, { start, length, from, to, peak = 0.5 }) {
      if (!noiseBuffer) {
        noiseBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.6), ctx.sampleRate);
        const samples = noiseBuffer.getChannelData(0);
        let seed = 7;
        for (let i = 0; i < samples.length; i += 1) {
          seed = (seed * 16807) % 2147483647;
          samples[i] = seed / 1073741823.5 - 1;
        }
      }
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      source.buffer = noiseBuffer;
      filter.type = 'bandpass';
      filter.Q.value = 1.4;
      filter.frequency.setValueAtTime(from, start);
      filter.frequency.exponentialRampToValueAtTime(to, start + length);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + length * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(out);
      source.start(start, 0, length + 0.02);
    }

    const RECIPES = {
      // A soft wooden "tok" when a child taps.
      tap(out, t) {
        tone(out, { type: 'triangle', from: 740, to: 520, start: t, length: 0.07, peak: 0.35, attack: 0.004 });
        return 0.09;
      },
      // Three rising twinkles for a right answer.
      sparkle(out, t) {
        [1047, 1319, 1568].forEach((from, index) => {
          tone(out, { from, start: t + index * 0.07, length: 0.22, peak: 0.28 });
          tone(out, { from: from * 2, start: t + index * 0.07, length: 0.12, peak: 0.06 });
        });
        return 0.4;
      },
      // An airy swish that rides the power move.
      whoosh(out, t) {
        noise(out, { start: t, length: 0.42, from: 380, to: 2600, peak: 1 });
        return 0.45;
      },
      // A bouncy pillow "boing" for a miss: up, then a wobbly slide down.
      boing(out, t) {
        const osc = tone(out, { from: 160, start: t, length: 0.5, peak: 0.42, attack: 0.01 });
        osc.frequency.cancelScheduledValues(t);
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(360, t + 0.07);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.46);
        const wobble = ctx.createOscillator();
        const depth = ctx.createGain();
        wobble.frequency.value = 16;
        depth.gain.value = 22;
        wobble.connect(depth);
        depth.connect(osc.frequency);
        wobble.start(t);
        wobble.stop(t + 0.52);
        return 0.55;
      },
      // A tiny "hee-hee-hee" wobble for the sparring buddy.
      giggle(out, t) {
        [0, 0.09, 0.18, 0.27].forEach((offset, index) => {
          const from = index % 2 ? 880 : 740;
          tone(out, { type: 'triangle', from, to: from * 1.25, start: t + offset, length: 0.075, peak: 0.45, attack: 0.006 });
        });
        return 0.38;
      },
      // A little fanfare and twinkle for the win.
      cheer(out, t) {
        [523, 659, 784].forEach((from, index) => {
          tone(out, { type: 'triangle', from, start: t + index * 0.13, length: 0.2, peak: 0.3 });
        });
        [1047, 1319].forEach(from => tone(out, { type: 'triangle', from, start: t + 0.39, length: 0.85, peak: 0.2, attack: 0.02 }));
        [1568, 2093, 2637].forEach((from, index) => tone(out, { from, start: t + 0.5 + index * 0.09, length: 0.25, peak: 0.08 }));
        return 1.3;
      },
    };

    function play(name, { delay = 0 } = {}) {
      if (muted || !RECIPES[name] || !context()) return false;
      wake();
      const now = ctx.currentTime;
      if (lastPlayed[name] !== undefined && now - lastPlayed[name] < MIN_GAP[name]) return false;
      voices = voices.filter(voice => voice.end > now);
      // Rapid taps retrigger an effect instead of stacking copies of it.
      voices.filter(voice => voice.name === name).forEach(voice => fadeOut(voice, now));
      voices = voices.filter(voice => voice.name !== name);
      if (voices.length >= MAX_VOICES) return false;
      lastPlayed[name] = now;
      const out = ctx.createGain();
      out.gain.value = 1;
      out.connect(effectsBus);
      const start = now + 0.01 + Math.max(0, delay);
      const length = RECIPES[name](out, start);
      voices.push({ name, out, end: start + length });
      return true;
    }

    function fadeOut(voice, now) {
      voice.out.gain.cancelScheduledValues(now);
      voice.out.gain.setValueAtTime(voice.out.gain.value, now);
      voice.out.gain.linearRampToValueAtTime(0, now + 0.03);
      voice.end = now;
    }

    function scheduleMusic() {
      while (nextStepTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
        const note = MELODY[step % MELODY.length];
        if (note) tone(musicBus, { from: note, start: nextStepTime, length: STEP_SECONDS * 1.6, peak: 0.5, attack: 0.05 });
        if (step % 4 === 0) {
          tone(musicBus, { type: 'triangle', from: BASS[Math.floor(step / 4) % BASS.length], start: nextStepTime, length: STEP_SECONDS * 3.8, peak: 0.45, attack: 0.08 });
        }
        nextStepTime += STEP_SECONDS;
        step += 1;
      }
    }

    function startMusic() {
      if (musicTimer !== null || muted || !musicOn || !context()) return;
      wake();
      nextStepTime = ctx.currentTime + 0.1;
      scheduleMusic();
      musicTimer = setTimer(scheduleMusic, 200);
    }

    function stopMusic() {
      if (musicTimer === null) return;
      clearTimer(musicTimer);
      musicTimer = null;
    }

    function setMusic(on) {
      musicOn = Boolean(on);
      if (musicOn) {
        startMusic();
      } else {
        stopMusic();
        step = 0;
      }
      applyLevels();
      return musicOn;
    }

    function setMuted(on) {
      muted = Boolean(on);
      if (muted) stopMusic();
      else startMusic();
      applyLevels();
      return muted;
    }

    // Narration and spoken reactions keep the spotlight: effects and music duck while they play.
    function setSpeaking(on) {
      speaking = Boolean(on);
      applyLevels();
    }

    // A hidden page stops the music loop; it picks up again when the page is visible.
    function setHidden(hidden) {
      if (hidden) stopMusic();
      else startMusic();
    }

    function getState() {
      return { muted, musicOn, speaking, musicPlaying: musicTimer !== null, voices: voices.length, available: !unavailable };
    }

    return { play, setMusic, setMuted, setSpeaking, setHidden, getState };
  }

  const api = { EFFECTS, EFFECT_LEVEL, MUSIC_LEVEL, createSoundBoard };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaSounds = api;
})();
