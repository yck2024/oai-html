import contextlib
import importlib.util
import io
import os
import subprocess
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch


SCRIPT_DIR = Path(__file__).parent


class GeneratorSelectionTests(unittest.TestCase):
    def run_cli(self, *arguments):
        environment = os.environ.copy()
        environment.pop("GEMINI_JOHN_API_KEY", None)
        return subprocess.run(
            [sys.executable, "generate_gemini_audio.py", *arguments],
            cwd=SCRIPT_DIR,
            env=environment,
            capture_output=True,
            text=True,
            check=False,
        )

    def test_unmatched_selectors_fail_in_generation_and_transcription(self):
        cases = [
            (("--story", "not-a-story"), "Unknown story ID"),
            (("--story", "bai-zei-qi", "--story", "not-a-story"), "Unknown story ID"),
            (("--clip", "not-a-clip"), "Unknown clip ID"),
            (("--clip", "p01-1", "--clip", "not-a-clip"), "Unknown clip ID"),
            (("--story", "bai-zei-qi", "--clip", "shooting-the-sun/p03-2"), "No clips match"),
        ]
        for operation in ((), ("--check",)):
            for selection, expected_error in cases:
                with self.subTest(operation=operation, selection=selection):
                    result = self.run_cli(*operation, *selection)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn(expected_error, result.stderr)
                    self.assertNotIn("All selected clips already exist", result.stdout)

    def test_transcript_export_and_worker_count_options_are_not_accepted(self):
        for arguments in (("--report", "unused.json"), ("--jobs", "2")):
            with self.subTest(arguments=arguments):
                result = self.run_cli(*arguments)
                self.assertEqual(result.returncode, 2)
                self.assertIn("unrecognized arguments", result.stderr)

    def test_check_reports_missing_selected_paths_for_story_and_clip_filters(self):
        spec = importlib.util.spec_from_file_location(
            "ehon_audio_generator", SCRIPT_DIR / "generate_gemini_audio.py"
        )
        generator = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(generator)
        stories = generator.load_stories()
        selections = [
            SimpleNamespace(story=["bai-zei-qi"], clip=None, language=["ja"], confirm=True),
            SimpleNamespace(story=None, clip=["bai-zei-qi/p01-1"], language=["ja"], confirm=True),
        ]
        missing_path = SCRIPT_DIR / "missing-selected-clip.mp3"

        for args in selections:
            with self.subTest(story=args.story, clip=args.clip):
                output = io.StringIO()
                with patch.object(generator, "clip_path", return_value=missing_path), \
                     patch.object(generator, "api_key_or_exit") as get_api_key, \
                     contextlib.redirect_stdout(output):
                    with self.assertRaises(SystemExit) as failure:
                        generator.check(stories, args)
                self.assertIn("selected clip(s) missing", str(failure.exception))
                self.assertIn("MISSING bai-zei-qi/ja/p01-1.mp3", output.getvalue())
                self.assertNotIn("0/0 transcripts match", output.getvalue())
                get_api_key.assert_not_called()


if __name__ == "__main__":
    unittest.main()
