#!/usr/bin/env python3
"""Build the Japanese MP3 clips with the official Gemini TTS API.

The static game never calls Gemini. Run this on a development machine with
ffmpeg and GEMINI_JOHN_API_KEY available in the environment. The credential
must remain private and is sent only in the official API request header.
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
OUTPUT_DIR = ROOT / "audio" / "ja"
API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-3.8-flash-tts"
VOICE = "ja-jp-tutor-1"
STYLE = "Warm, friendly, clear Japanese for a young child. Natural Tokyo Japanese, gently upbeat and unhurried."


def request_wav(api_key, text):
    payload = {
        "model": MODEL,
        "input": [{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": text,
                "annotations": [{"type": "speech_metadata", "style": STYLE}],
            }],
        }],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": VOICE}]},
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
    with tempfile.TemporaryDirectory(dir=OUTPUT_DIR) as temporary_directory:
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


def main():
    parser = argparse.ArgumentParser(description="Generate bundled Japanese Gemini TTS clips.")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate all existing Japanese clips")
    parser.add_argument("--clip", action="append", help="Regenerate only this prompt ID (repeatable)")
    parser.add_argument("--confirm", action="store_true", help="Authorize paid API requests")
    args = parser.parse_args()

    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg is required to encode the generated WAV clips")
    prompts = json.loads(PROMPTS.read_text(encoding="utf-8"))
    if args.clip:
        unknown = set(args.clip) - prompts.keys()
        if unknown:
            raise SystemExit(f"Unknown prompt ID(s): {', '.join(sorted(unknown))}")
        missing = {audio_id: prompts[audio_id]["ja"] for audio_id in dict.fromkeys(args.clip)}
    else:
        missing = {
            audio_id: translations["ja"]
            for audio_id, translations in prompts.items()
            if args.overwrite or not (OUTPUT_DIR / f"{audio_id}.mp3").is_file()
        }
    print(f"{len(missing)} Japanese clips to generate with {MODEL} / {VOICE}.")
    if not missing:
        print("All Japanese clips already exist.")
        return
    if not args.confirm:
        print("No API requests were made. Rerun with --confirm to authorize generation.")
        return
    api_key = os.environ.get("GEMINI_JOHN_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GEMINI_JOHN_API_KEY is not set; no API requests were made")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for index, (audio_id, text) in enumerate(missing.items(), start=1):
        wav = request_wav(api_key, text)
        encode_mp3(wav, OUTPUT_DIR / f"{audio_id}.mp3")
        print(f"Generated {index}/{len(missing)}: ja/{audio_id}.mp3")
        if index < len(missing):
            time.sleep(1)


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as error:
        raise SystemExit(str(error)) from None
