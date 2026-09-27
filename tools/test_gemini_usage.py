import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gemini_usage as usage


class GeminiUsageTests(unittest.TestCase):
    def test_cost_calculation_and_unknown_model(self):
        table = {"models": {"known": {
            "input_per_million": {"text": 2}, "output_per_million": {"audio": 4}
        }}}
        tokens = {"input": {"text": 1_000_000}, "output": {"audio": 500_000}}
        self.assertEqual(usage.estimate_cost("known", tokens, table), 4.0)
        self.assertIsNone(usage.estimate_cost("missing", tokens, table))
        self.assertIsNone(usage.estimate_cost("known", {"input": {"image": 1}, "output": {}}, table))

    def test_appends_without_credentials_to_external_env_ledger(self):
        with tempfile.TemporaryDirectory() as directory:
            ledger = Path(directory) / "nested" / "usage.jsonl"
            with patch.dict(os.environ, {"GEMINI_USAGE_LEDGER": str(ledger), "GEMINI_JOHN_API_KEY": "not-for-ledger"}):
                usage.append_usage("storybook", "ja/line-1", "unknown-model",
                                   {"input_tokens_by_modality": [{"modality": "text", "tokens": 3}],
                                    "total_output_tokens": 2}, output_modalities=["audio"])
            contents = ledger.read_text()
            self.assertNotIn("not-for-ledger", contents)
            entry = json.loads(contents)
            self.assertEqual(entry["tokens"], {"input": {"text": 3}, "output": {"audio": 2}})
            self.assertIsNone(entry["estimated_cost_usd"])
            self.assertEqual(entry["project"], "storybook")

    def test_ledger_failure_warns_without_raising_or_exposing_secrets(self):
        with patch.dict(os.environ, {"GEMINI_USAGE_LEDGER": str(usage.ROOT / "must-not-write.jsonl")}):
            from contextlib import redirect_stderr
            import io
            warning = io.StringIO()
            with redirect_stderr(warning):
                usage.append_usage("project", "clip", "unknown", {
                    "input_tokens_by_modality": [{"modality": "text", "tokens": 1}],
                })
        self.assertIn("WARNING", warning.getvalue())
        self.assertNotIn("GEMINI_JOHN_API_KEY", warning.getvalue())
        self.assertFalse((usage.ROOT / "must-not-write.jsonl").exists())

    def test_report_totals_by_project_model_and_day(self):
        entries = [
            {"timestamp": "2026-09-27T00:00:00Z", "project": "one", "model": "m",
             "tokens": {"input": {"text": 10}, "output": {"audio": 4}}, "estimated_cost_usd": 0.2},
            {"timestamp": "2026-09-27T01:00:00Z", "project": "two", "model": "m",
             "tokens": {"input": {"audio": 6}, "output": {"text": 2}}, "estimated_cost_usd": None},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "usage.jsonl"
            path.write_text("".join(json.dumps(entry) + "\n" for entry in entries))
            with patch.dict(os.environ, {"GEMINI_USAGE_LEDGER": str(path)}):
                summary = usage.report()
        self.assertEqual(summary["overall"]["calls"], 2)
        self.assertEqual(summary["overall"]["input_tokens"], {"text": 10, "audio": 6})
        self.assertEqual(summary["overall"]["output_tokens"], {"audio": 4, "text": 2})
        self.assertEqual(summary["overall"]["estimated_cost_usd"], 0.2)
        self.assertEqual(summary["overall"]["unknown_cost_calls"], 1)
        self.assertEqual(summary["project"]["one"]["calls"], 1)
        self.assertEqual(summary["model"]["m"]["calls"], 2)
        self.assertEqual(summary["day"]["2026-09-27"]["calls"], 2)
        self.assertIn("estimates", summary["note"])

    def test_interactions_usage_without_input_breakdown(self):
        with_output = usage.token_counts({
            "total_input_tokens": 100,
            "total_output_tokens": 500,
        }, output_modalities=["audio"])
        self.assertEqual(with_output, {
            "input": {"text": 100}, "output": {"audio": 500}
        })

        input_only = usage.token_counts({"total_input_tokens": 100})
        self.assertEqual(input_only, {"input": {"text": 100}, "output": {}})

    def test_generate_content_usage_modalities(self):
        result = usage.token_counts({
            "promptTokenCount": 5,
            "promptTokensDetails": [{"modality": "TEXT", "tokenCount": 2},
                                     {"modality": "AUDIO", "tokenCount": 3}],
            "candidatesTokenCount": 4,
        }, api="generate_content")
        self.assertEqual(result, {"input": {"text": 2, "audio": 3}, "output": {"text": 4}})


if __name__ == "__main__":
    unittest.main()
