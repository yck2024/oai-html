"""Create the Japanese Aivis voice clips used by the static game bundle.

The API key is requested without echo and is never written to the project.
Run only after confirming the Aivis model and character budget.
"""

from __future__ import annotations

import argparse
import getpass
import json
import os
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


API_URL = "https://api.aivis-project.com/v1/tts/synthesize"
DEFAULT_MODEL_UUID = "a59cb814-0083-4369-8542-f51a29e72af7"  # Aivis demo default: まお
ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "audio"
POKO_AUDIO_DIR = ROOT.parent / "poko" / "audio"


def audio_dir_for(name: str) -> Path:
    return POKO_AUDIO_DIR if name.startswith("poko-") else AUDIO_DIR


def build_clips() -> dict[str, str]:
    clips = {
        "count-garden": "りんごは、いくつあるかな？あうかずをタップしてね。",
        "count-ocean": "かいがらは、いくつあるかな？あうかずをタップしてね。",
        "count-space": "ほしのいしは、いくつあるかな？あうかずをタップしてね。",
        "correct": "せいかい！すごいね！",
        "try-again": "おしい！いっしょにかぞえてみよう。",
        "finish": "ぼうけんクリア！やったね！",
        "poko-count": "りんごは なんこ あるかな？",
        "poko-correct": "せいかい！すごいね！",
        "poko-try-again": "おしい！りんごを もういちど かぞえてみよう。",
        "poko-finish": "ほしを 8こ あつめたよ！ポコと いっしょに おいわいしよう。",
    }
    for first in range(1, 6):
        for second in range(1, 10 - first):
            clips[f"addition-{first}-{second}"] = f"{first}たす{second}は、いくつかな？"
    for first, second in ((1, 1), (1, 2), (1, 3), (1, 4), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2)):
        clips[f"poko-add-{first}-{second}"] = f"{first}こ と {second}こ。あわせて いくつかな？"
    return clips


def load_api_key() -> str:
    """Read the key from the process environment or this folder's private .env."""
    key = os.environ.get("AIVIS_API_KEY", "").strip()
    if key:
        return key

    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            name, separator, value = line.partition("=")
            if separator and name.strip() == "AIVIS_API_KEY":
                return value.strip().strip("\"'")
    return getpass.getpass("Aivis Cloud API key (hidden): ").strip()


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate bundled Japanese Aivis MP3 prompts.")
    parser.add_argument("--model-uuid", default=DEFAULT_MODEL_UUID, help="Aivis model UUID or access key")
    parser.add_argument("--max-characters", type=int, default=1000, help="Stop before exceeding this text length")
    parser.add_argument("--delay", type=float, default=6.2, help="Seconds between requests (default stays below 10/min)")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate clips that already exist")
    args = parser.parse_args()

    clips = build_clips()
    chars = sum(len(text) for text in clips.values())
    missing = {name: text for name, text in clips.items() if args.overwrite or not (audio_dir_for(name) / f"{name}.mp3").exists()}
    missing_chars = sum(len(text) for text in missing.values())
    estimated_yen = missing_chars * 440 / 10000
    print(f"{len(clips)} clips total; {len(missing)} need generation; {missing_chars} billed characters.")
    print(f"Approximate pay-as-you-go cost for these characters: ¥{estimated_yen:.0f} (plan dependent).")
    print(f"All clip text is {chars} characters; selected cap is {args.max_characters}.")
    if chars > args.max_characters:
        print("Character cap exceeded; no API requests were made.")
        return 2
    if not missing:
        print("All clips already exist.")
        return 0
    if input("Proceed with Aivis generation? Type yes: ").strip().lower() != "yes":
        print("No API requests were made.")
        return 0

    api_key = load_api_key()
    if not api_key:
        print("No API key entered; no requests were made.")
        return 2
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    POKO_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    for index, (name, text) in enumerate(missing.items(), start=1):
        payload = {
            "model_uuid": args.model_uuid,
            "text": text,
            "language": "ja",
            "speaking_rate": 0.9,
            "use_volume_normalizer": True,
            "output_format": "mp3",
            "leading_silence_seconds": 0.0,
            "trailing_silence_seconds": 0.12,
        }
        request = Request(
            API_URL,
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=90) as response:
                audio = response.read()
                content_type = response.headers.get("Content-Type", "")
        except HTTPError as error:
            print(f"Aivis request failed with HTTP {error.code}; stopped after {index - 1} clips.")
            return 1
        except (URLError, TimeoutError) as error:
            print(f"Aivis request failed ({type(error).__name__}); stopped after {index - 1} clips.")
            return 1
        if not audio or (content_type and "audio" not in content_type.lower()):
            print(f"Aivis returned an unexpected response for {name}; stopped after {index - 1} clips.")
            return 1
        (audio_dir_for(name) / f"{name}.mp3").write_bytes(audio)
        print(f"Generated {index}/{len(missing)}: {name}")
        if index < len(missing):
            time.sleep(max(0, args.delay))

    print(f"Saved {len(missing)} audio clips to {AUDIO_DIR} and {POKO_AUDIO_DIR}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
