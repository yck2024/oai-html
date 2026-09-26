#!/usr/bin/env python3
"""Build the game's local prompt MP3s with the Gemini 3.8 Flash TTS API.

The static game never calls Gemini. Run on a development machine with ffmpeg
and GEMINI_JOHN_API_KEY available in the environment. The credential is sent
only in the official API request header and is never written to this project.
"""

import argparse
import base64
import json
import os
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
PROMPTS = ROOT / "audio" / "prompts.json"
AUDIO_DIR = ROOT / "audio"
API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-3.8-flash-tts"
LANGUAGES = {
    "en": {
        "voice": "Aoede",
        "locale": "en-US",
        "style": (
            "Warm, friendly, clear English for a young child. Gently upbeat and "
            "unhurried, with natural General American pronunciation. Speak only "
            "the supplied words."
        ),
    },
    "zh": {
        "voice": "Kore",
        "locale": "zh-TW",
        "style": (
            "Natural, clear Taiwan Mandarin (zh-TW; 臺灣國語) from Taiwan, with "
            "standard Taiwanese Mandarin pronunciation and intonation as spoken "
            "in Taipei—not Mainland Chinese Putonghua. Speak exactly and only "
            "the supplied Traditional Chinese transcript; do not translate, "
            "paraphrase, or add words or sentence-final particles. Warm, friendly, "
            "gently upbeat, and unhurried for a young child."
        ),
    },
    "ja": {
        "voice": "ja-jp-tutor-1",
        "locale": "ja-JP",
        "style": (
            "Warm, friendly, clear Japanese for a young child. Natural Tokyo "
            "Japanese, gently upbeat and unhurried."
        ),
    },
}

# 姊姊 is sometimes read with 姊's literary zǐ reading; 姐姐 is the same-sounding
# Taiwan Mandarin family term and gives the intended jiějie pronunciation.
PRONUNCIATION_OVERRIDES = {("zh", "family-sister"): "誰是姐姐？"}


def request_wav(api_key, text, language_config):
    payload = {
        "model": MODEL,
        "input": [{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": text,
                "annotations": [{"type": "speech_metadata", "style": language_config["style"]}],
            }],
        }],
        "response_format": {"type": "audio"},
        "generation_config": {
            "speech_config": [{
                "voice": language_config["voice"],
                "language": language_config["locale"],
            }],
        },
    }
    request = Request(
        API_URL,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=120) as response:
            result = json.loads(response.read())
    except HTTPError as error:
        raise RuntimeError(f"Gemini TTS request failed with HTTP {error.code}") from None
    except (URLError, TimeoutError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Gemini TTS request failed ({type(error).__name__})") from None

    for step in result.get("steps", []):
        for content in step.get("content", []):
            if content.get("type") == "audio" and content.get("data"):
                audio = base64.b64decode(content["data"])
                if audio.startswith(b"RIFF") and audio[8:12] == b"WAVE" and len(audio) > 2048:
                    return audio
    raise RuntimeError("Gemini TTS response did not contain a valid WAV audio clip")


def encode_mp3(wav, output):
    with tempfile.TemporaryDirectory(dir=output.parent) as temporary_directory:
        source = Path(temporary_directory) / "prompt.wav"
        encoded = Path(temporary_directory) / "prompt.mp3"
        source.write_bytes(wav)
        try:
            subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                 "-codec:a", "libmp3lame", "-q:a", "5", str(encoded)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        except subprocess.CalledProcessError:
            raise RuntimeError("ffmpeg could not encode the generated WAV") from None
        if not encoded.is_file() or encoded.stat().st_size < 1024:
            raise RuntimeError("ffmpeg returned an empty MP3")
        encoded.replace(output)


def selected_clips(prompts, languages, clip_ids, overwrite):
    if clip_ids:
        unknown = set(clip_ids) - prompts.keys()
        if unknown:
            raise SystemExit(f"Unknown prompt ID(s): {', '.join(sorted(unknown))}")
        prompt_ids = dict.fromkeys(clip_ids)
    else:
        prompt_ids = prompts

    return [
        (language, audio_id, PRONUNCIATION_OVERRIDES.get((language, audio_id), prompts[audio_id][language]))
        for language in languages
        for audio_id in prompt_ids
        if overwrite or not (AUDIO_DIR / language / f"{audio_id}.mp3").is_file()
    ]


def main():
    parser = argparse.ArgumentParser(description="Generate bundled Gemini TTS prompt clips in English, Taiwan Mandarin, and Japanese.")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate selected existing clips")
    parser.add_argument("--clip", action="append", help="Generate only this prompt ID (repeatable)")
    parser.add_argument("--language", action="append", choices=LANGUAGES, help="Limit generation to this language (repeatable)")
    parser.add_argument("--confirm", action="store_true", help="Authorize paid API requests")
    args = parser.parse_args()

    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg is required to encode the generated WAV clips")
    prompts = json.loads(PROMPTS.read_text(encoding="utf-8"))
    languages = args.language or list(LANGUAGES)
    clips = selected_clips(prompts, languages, args.clip, args.overwrite)
    print(f"{len(clips)} clips to generate with {MODEL}.")
    if not clips:
        print("All selected clips already exist.")
        return
    if not args.confirm:
        print("No API requests were made. Rerun with --confirm to authorize generation.")
        return
    api_key = os.environ.get("GEMINI_JOHN_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GEMINI_JOHN_API_KEY is not set; no API requests were made")

    for index, (language, audio_id, text) in enumerate(clips, start=1):
        output_dir = AUDIO_DIR / language
        output_dir.mkdir(parents=True, exist_ok=True)
        wav = request_wav(api_key, text, LANGUAGES[language])
        encode_mp3(wav, output_dir / f"{audio_id}.mp3")
        print(f"Generated {index}/{len(clips)}: {language}/{audio_id}.mp3")
        if index < len(clips):
            time.sleep(1)


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as error:
        raise SystemExit(str(error)) from None
