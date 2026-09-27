#!/usr/bin/env python3
"""Build japan-ehon's narration MP3s with Gemini 3.8 Flash TTS, and check them.

Same generator design as taiwan-ehon/generate_gemini_audio.py (this is a per-series copy, not a
shared engine file, because SPEAKERS below is inherently per-series content — see this series'
README's "The shared engine" cross-reference for why). The one functional difference is this
series' extra `en` language, for series.config.js's optional third language.

The static page never calls Gemini. Run on a development machine with node, ffmpeg, and
GEMINI_JOHN_API_KEY in the environment. The credential is sent only in the official API
request header and is never written to this project or printed.

Every sentence is one clip per language (audio/<story>/<ja|zh|en>/<line>.mp3), voiced by the
narrator or a story character with that line's style direction. --check transcribes the
bundled clips with a Gemini text model so misreadings can be caught and regenerated.

The English narrator voice was chosen by an audition recorded in this series' README ("English
narration").
"""

import argparse
import base64
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent / "tools"))
from gemini_usage import append_usage

AUDIO_DIR = ROOT / "audio"
TTS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
TTS_MODEL = "gemini-3.8-flash-tts"
CHECK_MODEL = "gemini-3.8-flash"
CHECK_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{CHECK_MODEL}:generateContent"
MAX_WORKERS = 4
RUBY = re.compile(r"\{([^|{}]+)\|([^|{}]+)\}")

LANGUAGES = {
    "ja": {
        "locale": "ja-JP",
        "style": (
            "Natural, warm Tokyo Japanese, read aloud from a children's picture book to a "
            "young child. Expressive storyteller acting with clear diction and an unhurried pace."
        ),
    },
    "zh": {
        "locale": "zh-TW",
        "style": (
            "Natural, clear Taiwan Mandarin (zh-TW; 臺灣國語) from Taiwan, with standard "
            "Taiwanese Mandarin pronunciation and intonation as spoken in Taipei—not Mainland "
            "Chinese Putonghua, no erhua. Read aloud from a children's picture book to a young "
            "child: expressive storyteller acting with clear diction and an unhurried pace."
        ),
    },
    "en": {
        "locale": "en-US",
        "style": (
            "Natural, warm American English, read aloud from a children's picture book to a "
            "young child. Expressive storyteller acting with clear diction and an unhurried "
            "pace, the same register as the ja/zh narration above."
        ),
    },
}

# Voice casting per speaker key used in stories/*.js's "speaker" field; add one entry per named
# character as stories are written, the same way taiwan-ehon's SPEAKERS grew story by story. The
# `en` narrator voice (Kore) was chosen by the audition recorded in this series' README.
SPEAKERS = {
    "narrator": {
        "persona": "the warm storyteller of a picture book, reading to a young child",
        "voices": {"ja": "ja-jp-tutor-1", "zh": "Kore", "en": "Kore"},
    },
    "grandpa": {
        "persona": "a kind, gentle old man from a Japanese mountain village",
        "voices": {"ja": "ja-jp-storyteller-4", "zh": "Algenib", "en": "Algenib"},
    },
    "grandma": {
        "persona": "a warm, cheerful old woman who loves her family",
        "voices": {"ja": "ja-jp-storyteller-8", "zh": "Gacrux", "en": "Gacrux"},
    },
    "jizo": {
        "persona": "a soft, friendly chorus of stone Jizo guardians, calm and kind, never eerie",
        "voices": {"ja": "ja-jp-storyteller-5", "zh": "Iapetus", "en": "Iapetus"},
    },
    "momotaro": {
        "persona": "Momotaro, a brave, cheerful, kind boy of about twelve",
        "voices": {"ja": "ja-jp-assistant-12", "zh": "Puck", "en": "Puck"},
    },
    "dog": {
        "persona": "an eager, friendly, loyal dog",
        "voices": {"ja": "ja-jp-assistant-7", "zh": "Fenrir", "en": "Fenrir"},
    },
    "oni": {
        "persona": "a big, blustery, comically clumsy oni who turns out to be sorry, never scary",
        "voices": {"ja": "ja-jp-storyteller-11", "zh": "Charon", "en": "Charon"},
    },
    "kaguya": {
        "persona": "Kaguya-hime, a graceful, gentle, kind young woman",
        "voices": {"ja": "ja-jp-storyteller-2", "zh": "Leda", "en": "Leda"},
    },
    "urashima": {
        "persona": "Urashima Taro, a warm, kind young fisherman",
        "voices": {"ja": "ja-jp-podcaster-8", "zh": "Orus", "en": "Orus"},
    },
    "turtle": {
        "persona": "a gentle, grateful, slightly formal sea turtle",
        "voices": {"ja": "ja-jp-assistant-9", "zh": "Achird", "en": "Achird"},
    },
    "otohime": {
        "persona": "Princess Otohime of the Dragon Palace, graceful, warm, and kind",
        "voices": {"ja": "ja-jp-storyteller-2", "zh": "Leda", "en": "Leda"},
    },
    "villager": {
        "persona": "a kind, thoughtful old village man",
        "voices": {"ja": "ja-jp-storyteller-4", "zh": "Algenib", "en": "Algenib"},
    },
    "ojiisan": {
        "persona": "a kind, gentle old man from a Japanese village, warm and soft-spoken",
        "voices": {"ja": "ja-jp-storyteller-5", "zh": "Iapetus", "en": "Iapetus"},
    },
    "neighbor": {
        "persona": "a fussy, comically greedy old neighbor, silly rather than scary",
        "voices": {"ja": "ja-jp-storyteller-4", "zh": "Algenib", "en": "Algenib"},
    },
    "shiro": {
        "persona": "a happy, bouncy little white dog calling out eagerly",
        "voices": {"ja": "ja-jp-assistant-9", "zh": "Autonoe", "en": "Autonoe"},
    },
    "mouse": {
        "persona": "a tiny, cheerful, polite little mouse singing and chattering",
        "voices": {"ja": "ja-jp-assistant-3", "zh": "Leda", "en": "Leda"},
    },
    "issun": {
        "persona": "a brave, bright, thumb-sized little boy with a clear ringing voice",
        "voices": {"ja": "ja-jp-assistant-7", "zh": "Fenrir", "en": "Fenrir"},
    },
    "princess": {
        "persona": "a kind, bright girl of about twelve, a nobleman's daughter",
        "voices": {"ja": "ja-jp-assistant-9", "zh": "Aoede", "en": "Aoede"},
    },
    "akaoni": {
        "persona": "a big, blustery, clumsy red ogre, loud but silly and never frightening",
        "voices": {"ja": "ja-jp-storyteller-4", "zh": "Algenib", "en": "Algenib"},
    },
    "daughter": {
        "persona": "a gentle, polite young woman with a calm, soft voice",
        "voices": {"ja": "ja-jp-storyteller-2", "zh": "Leda", "en": "Leda"},
    },
}


def load_stories():
    script = "process.stdout.write(JSON.stringify(require('./stories.js')))"
    try:
        output = subprocess.run(["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True).stdout
    except (OSError, subprocess.CalledProcessError):
        raise SystemExit("node is required to read stories.js") from None
    return json.loads(output)


def spoken_text(line, language):
    """The words sent to the narrator: language-specific text, with optional pronunciation overrides."""
    if language == "ja":
        return line.get("jaTts") or re.sub(r"[ 　]+", "", RUBY.sub(r"\2", line["ja"]))
    if language == "zh":
        return line.get("zhTts") or line["zh"]
    if language == "en":
        return line.get("enTts") or line.get("en")
    raise ValueError(f"Unsupported language: {language}")


def style_for(line, language):
    speaker = SPEAKERS[line["speaker"]]
    return (
        f"{LANGUAGES[language]['style']} Voice {speaker['persona']}. "
        f"Delivery for this line: {line['style']}. Speak exactly and only the supplied words."
    )


def all_clips(stories):
    for story in stories:
        for page in story["pages"]:
            for line in page["lines"]:
                for language in LANGUAGES:
                    if language == "ja" or language == "zh" or line.get(language):
                        yield story["id"], line, language


def clip_path(story_id, language, line_id):
    return AUDIO_DIR / story_id / language / f"{line_id}.mp3"


def post_json(url, api_key, payload, timeout=120):
    request = Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=timeout) as response:
            return json.loads(response.read())
    except HTTPError as error:
        raise RuntimeError(f"Gemini request failed with HTTP {error.code}") from None
    except (URLError, TimeoutError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Gemini request failed ({type(error).__name__})") from None


def request_wav(api_key, text, style, voice, locale, project, clip_id):
    payload = {
        "model": TTS_MODEL,
        "input": [{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": text,
                "annotations": [{"type": "speech_metadata", "style": style}],
            }],
        }],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": voice, "language": locale}]},
    }
    result = post_json(TTS_URL, api_key, payload)
    modalities = [content.get("type", "unknown") for step in result.get("steps", [])
                  for content in step.get("content", []) if content.get("type") in {"audio", "text"}]
    append_usage(project, clip_id, TTS_MODEL, result.get("usage", {}),
                 output_modalities=modalities or ["audio"])
    for step in result.get("steps", []):
        for content in step.get("content", []):
            if content.get("type") == "audio" and content.get("data"):
                audio = base64.b64decode(content["data"])
                if audio.startswith(b"RIFF") and audio[8:12] == b"WAVE" and len(audio) > 2048:
                    return audio
    raise RuntimeError("Gemini TTS response did not contain a valid WAV audio clip")


def encode_mp3(wav, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=output.parent) as temporary_directory:
        source = Path(temporary_directory) / "line.wav"
        encoded = Path(temporary_directory) / "line.mp3"
        source.write_bytes(wav)
        try:
            # Trim silence at both ends so sentence-by-sentence playback keeps a steady rhythm.
            subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                 "-af", "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,"
                        "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.12,areverse",
                 "-ac", "1", "-codec:a", "libmp3lame", "-q:a", "6", str(encoded)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        except subprocess.CalledProcessError:
            raise RuntimeError("ffmpeg could not encode the generated WAV") from None
        if not encoded.is_file() or encoded.stat().st_size < 1024:
            raise RuntimeError("ffmpeg returned an empty MP3")
        encoded.replace(output)


def transcribe(api_key, path, language, project, clip_id):
    if language == "ja":
        instruction = (
            "Transcribe this Japanese speech exactly as it is pronounced, written entirely in "
            "hiragana (katakana only for foreign-sounding names). Do not correct or add anything. "
            "Reply with the transcript only."
        )
    elif language == "en":
        instruction = (
            "Transcribe this English speech exactly as heard. Do not translate, correct, or add "
            "anything. Reply with the transcript only."
        )
    else:
        instruction = (
            "Transcribe this Mandarin speech. Line 1: the words in Traditional Chinese characters. "
            "Line 2: Hanyu Pinyin with tone marks exactly as the syllables are actually pronounced "
            "in the audio, including any misreading; do not correct to dictionary readings. "
            "Reply with those two lines only."
        )
    payload = {
        "contents": [{"parts": [
            {"text": instruction},
            {"inline_data": {"mime_type": "audio/mpeg", "data": base64.b64encode(path.read_bytes()).decode("ascii")}},
        ]}],
        "generationConfig": {"temperature": 0},
    }
    result = post_json(CHECK_URL, api_key, payload)
    append_usage(project, clip_id, CHECK_MODEL, result.get("usageMetadata", {}),
                 api="generate_content", output_modalities=["text"])
    try:
        return "".join(part.get("text", "") for part in result["candidates"][0]["content"]["parts"]).strip()
    except (KeyError, IndexError):
        raise RuntimeError("Gemini transcription response had no text") from None


# Script/variant folding so a spoken character equivalent to the displayed one (e.g. a
# simplified stand-in used to steer TTS pronunciation) isn't flagged as a misreading.
HAN_VARIANTS = str.maketrans({"贼": "賊", "揹": "背"})


def comparable(text, language):
    text = unicodedata.normalize("NFKC", text)
    if language == "ja":
        # Compare as hiragana: katakana names fold to hiragana, the long-vowel mark and
        # punctuation are ignored.
        text = "".join(chr(ord(char) - 0x60) if "ァ" <= char <= "ヶ" else char for char in text)
        return re.sub(r"[^ぁ-ゖ]", "", text)
    if language == "en":
        return re.sub(r"[^\w]", "", text.casefold(), flags=re.UNICODE)
    text = re.sub(r"[^㐀-鿿]", "", text)
    return text.translate(HAN_VARIANTS)


def expected_reading(line, language):
    if language == "ja":
        return comparable(RUBY.sub(r"\2", line["ja"]), language)
    return comparable(spoken_text(line, language), language)


def selected(stories, args):
    clips = list(all_clips(stories))
    requested_stories = set(args.story or [])
    requested_clips = set(args.clip or [])
    story_ids = {story_id for story_id, _, _ in clips}
    line_ids = {line["id"] for _, line, _ in clips}
    qualified_line_ids = {f"{story_id}/{line['id']}" for story_id, line, _ in clips}
    unknown_stories = requested_stories - story_ids
    unknown_clips = requested_clips - line_ids - qualified_line_ids
    if unknown_stories:
        raise SystemExit(f"Unknown story ID(s): {', '.join(sorted(unknown_stories))}")
    if unknown_clips:
        raise SystemExit(f"Unknown clip ID(s): {', '.join(sorted(unknown_clips))}")

    matches = [
        (story_id, line, language)
        for story_id, line, language in clips
        if (not requested_stories or story_id in requested_stories)
        and (not args.language or language in args.language)
        and (not requested_clips or line["id"] in requested_clips
             or f"{story_id}/{line['id']}" in requested_clips)
    ]
    if (requested_stories or requested_clips) and not matches:
        raise SystemExit("No clips match the requested story/clip selection")
    yield from matches


def api_key_or_exit():
    api_key = os.environ.get("GEMINI_JOHN_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GEMINI_JOHN_API_KEY is not set; no API requests were made")
    return api_key


def generate(stories, args):
    clips = [clip for clip in selected(stories, args)
             if args.overwrite or not clip_path(clip[0], clip[2], clip[1]["id"]).is_file()]
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg is required to encode the generated WAV clips")
    print(f"{len(clips)} clips to generate with {TTS_MODEL}.")
    if not clips:
        print("All selected clips already exist.")
        return
    if not args.confirm:
        print("No API requests were made. Rerun with --confirm to authorize generation.")
        return
    api_key = api_key_or_exit()

    def work(clip):
        story_id, line, language = clip
        voice = SPEAKERS[line["speaker"]]["voices"][language]
        wav = request_wav(api_key, spoken_text(line, language), style_for(line, language), voice,
                          LANGUAGES[language]["locale"], story_id, f"{language}/{line['id']}")
        encode_mp3(wav, clip_path(story_id, language, line["id"]))
        return f"{story_id}/{language}/{line['id']}.mp3"

    failures = 0
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(work, clip): clip for clip in clips}
        for index, future in enumerate(as_completed(futures), start=1):
            story_id, line, language = futures[future]
            try:
                print(f"Generated {index}/{len(clips)}: {future.result()}")
            except RuntimeError as error:
                failures += 1
                print(f"FAILED {index}/{len(clips)}: {story_id}/{language}/{line['id']}.mp3 ({error})")
    if failures:
        raise SystemExit(f"{failures} clip(s) failed; rerun without --overwrite to fill only the missing ones")


def check(stories, args):
    clips = list(selected(stories, args))
    missing = [clip for clip in clips if not clip_path(clip[0], clip[2], clip[1]["id"]).is_file()]
    if missing:
        for story_id, line, language in missing:
            print(f"MISSING {story_id}/{language}/{line['id']}.mp3")
        raise SystemExit(f"{len(missing)} selected clip(s) missing; transcription aborted")
    print(f"{len(clips)} clips to transcribe with {CHECK_MODEL}.")
    if not args.confirm:
        print("No API requests were made. Rerun with --confirm to authorize transcription.")
        return
    api_key = api_key_or_exit()

    def work(clip):
        story_id, line, language = clip
        return transcribe(api_key, clip_path(story_id, language, line["id"]), language,
                          story_id, f"{language}/{line['id']}")

    report = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(work, clip): clip for clip in clips}
        for future in as_completed(futures):
            story_id, line, language = futures[future]
            try:
                heard = future.result()
            except RuntimeError as error:
                heard = f"ERROR: {error}"
            first_line = heard.splitlines()[0] if heard else ""
            match = comparable(first_line, language) == expected_reading(line, language)
            report.append({"clip": f"{story_id}/{language}/{line['id']}", "match": match,
                           "expected": line["ja"] if language == "ja" else line["zh"] if language == "zh" else spoken_text(line, "en"),
                           "heard": heard})
    report.sort(key=lambda item: item["clip"])
    for item in report:
        mark = "ok  " if item["match"] else "DIFF"
        print(f"{mark} {item['clip']}\n     expected: {item['expected']}\n     heard:    {item['heard'].replace(chr(10), ' / ')}")
    print(f"{sum(item['match'] for item in report)}/{len(report)} transcripts match the text exactly; review every DIFF and the pinyin by ear or eye.")


def main():
    parser = argparse.ArgumentParser(description="Generate or check the picture books' Gemini TTS narration.")
    parser.add_argument("--check", action="store_true", help="Transcribe existing clips instead of generating")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate selected existing clips")
    parser.add_argument("--story", action="append", help="Limit to this story ID (repeatable)")
    parser.add_argument("--clip", action="append", help="Limit to this line ID, e.g. p03-2 or bai-zei-qi/p03-2 (repeatable)")
    parser.add_argument("--language", action="append", choices=LANGUAGES, help="Limit to this language (repeatable)")
    parser.add_argument("--confirm", action="store_true", help="Authorize paid API requests")
    args = parser.parse_args()

    stories = load_stories()
    speakers = {line["speaker"] for _, line, _ in all_clips(stories)}
    if speakers - SPEAKERS.keys():
        raise SystemExit(f"No voice configured for speaker(s): {', '.join(sorted(speakers - SPEAKERS.keys()))}")
    (check if args.check else generate)(stories, args)


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as error:
        raise SystemExit(str(error)) from None
