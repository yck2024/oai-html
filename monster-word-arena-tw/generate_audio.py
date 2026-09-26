#!/usr/bin/env python3
"""Generate bundled English and Taiwan Mandarin prompts with macOS voices.

Run on a Mac with the built-in `say` command and ffmpeg installed. The game
plays only these local MP3 files; no speech service is contacted at runtime.
"""

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROMPTS = ROOT / "audio" / "prompts.json"
VOICES = {"en": "Samantha", "zh": "Meijia"}


def main():
    missing = [command for command in ("say", "ffmpeg") if shutil.which(command) is None]
    if missing:
        raise SystemExit(f"Missing required local tool(s): {', '.join(missing)}")

    prompts = json.loads(PROMPTS.read_text(encoding="utf-8"))
    for language, voice in VOICES.items():
        output_dir = ROOT / "audio" / language
        output_dir.mkdir(parents=True, exist_ok=True)
        for audio_id, translations in prompts.items():
            text = translations[language]
            output = output_dir / f"{audio_id}.mp3"
            with tempfile.TemporaryDirectory(dir=output_dir) as temp_dir:
                source = Path(temp_dir) / "prompt.aiff"
                encoded = Path(temp_dir) / "prompt.mp3"
                subprocess.run(
                    ["say", "-v", voice, "-r", "168", "-o", str(source), text],
                    check=True,
                )
                subprocess.run(
                    ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                     "-codec:a", "libmp3lame", "-q:a", "5", str(encoded)],
                    check=True,
                )
                if not encoded.is_file() or encoded.stat().st_size < 1024:
                    raise SystemExit(f"Generated audio is empty or too small: {language}/{audio_id}")
                encoded.replace(output)
            print(f"Generated {language}/{audio_id}.mp3")


if __name__ == "__main__":
    main()
