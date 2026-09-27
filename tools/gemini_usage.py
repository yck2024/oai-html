#!/usr/bin/env python3
"""Append and report estimated Gemini API usage for the narration generators."""

import json
import os
import sys
from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRICE_PATH = ROOT / "tools" / "gemini-prices.json"
DEFAULT_LEDGER = Path.home() / ".local" / "share" / "api-usage" / "gemini.jsonl"


def ledger_path():
    return Path(os.environ.get("GEMINI_USAGE_LEDGER", DEFAULT_LEDGER)).expanduser()


def token_counts(usage, api="interactions", output_modalities=None):
    """Normalize Gemini Interactions usage or generateContent usageMetadata."""
    output_modalities = output_modalities or ["text"]
    inputs = defaultdict(int)
    outputs = defaultdict(int)
    if api == "interactions":
        for entry in usage.get("input_tokens_by_modality", []):
            inputs[str(entry["modality"]).lower()] += int(entry["tokens"])
        output_total = int(usage.get("total_output_tokens", 0))
        thought_total = int(usage.get("total_thought_tokens", 0))
        if output_total:
            # Interactions usage reports total output but not output modality; infer it
            # from returned content blocks (TTS uses audio, transcription uses text).
            split_outputs(output_total, output_modalities, outputs)
        if thought_total:
            # Google's pricing counts thinking tokens at the output rate.
            outputs["text"] += thought_total
    else:
        for entry in usage.get("promptTokensDetails", []):
            inputs[str(entry["modality"]).lower()] += int(entry["tokenCount"])
        input_total = int(usage.get("promptTokenCount", 0))
        if input_total and not inputs:
            inputs["text"] = input_total
        output_total = int(usage.get("candidatesTokenCount", 0))
        if output_total:
            split_outputs(output_total, output_modalities, outputs)
    return {"input": dict(inputs), "output": dict(outputs)}


def split_outputs(count, modalities, output):
    # Single-output-modality calls are used here; avoid inventing a split otherwise.
    if len(set(modalities)) == 1:
        output[modalities[0]] += count
    else:
        output["unknown"] += count


def estimate_cost(model, tokens, price_table=None):
    table = price_table if price_table is not None else json.loads(PRICE_PATH.read_text())
    model_prices = table["models"].get(model)
    if model_prices is None:
        return None
    total = Decimal("0")
    for direction in ("input", "output"):
        prices = model_prices.get(f"{direction}_per_million", {})
        for modality, count in tokens.get(direction, {}).items():
            if modality not in prices:
                return None
            total += Decimal(str(prices[modality])) * int(count) / Decimal(1_000_000)
    return float(total)


def append_usage(project, clip_id, model, usage, api="interactions", output_modalities=None):
    """Record only usage metadata; suppress all ledger failures so builds continue."""
    try:
        counts = token_counts(usage, api=api, output_modalities=output_modalities)
        if not counts["input"] and not counts["output"]:
            return
        price_table = json.loads(PRICE_PATH.read_text(encoding="utf-8"))
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "project": project,
            "clip_id": clip_id,
            "model": model,
            "tokens": counts,
            "estimated_cost_usd": estimate_cost(model, counts, price_table),
        }
        path = ledger_path().resolve()
        if path == ROOT or ROOT in path.parents:
            raise ValueError("ledger path must be outside the repository")
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as ledger:
            ledger.write(json.dumps(entry, sort_keys=True) + "\n")
    except Exception as error:  # Accounting is best-effort and must never fail generation.
        print(f"WARNING: could not record Gemini usage in local ledger ({type(error).__name__})", file=sys.stderr)


def _summary(entries):
    inputs, outputs = defaultdict(int), defaultdict(int)
    cost = 0.0
    unknown_cost = 0
    for entry in entries:
        for modality, count in entry.get("tokens", {}).get("input", {}).items():
            inputs[modality] += count
        for modality, count in entry.get("tokens", {}).get("output", {}).items():
            outputs[modality] += count
        if entry.get("estimated_cost_usd") is None:
            unknown_cost += 1
        else:
            cost += entry["estimated_cost_usd"]
    return {"calls": len(entries), "input_tokens": dict(inputs), "output_tokens": dict(outputs),
            "estimated_cost_usd": round(cost, 12), "unknown_cost_calls": unknown_cost}


def report(path=None):
    path = Path(path) if path else ledger_path()
    if path.exists():
        with path.open(encoding="utf-8") as ledger:
            entries = [json.loads(line) for line in ledger if line.strip()]
    else:
        entries = []
    groups = {}
    for key_name, get_key in (
        ("project", lambda e: e.get("project", "unknown")),
        ("model", lambda e: e.get("model", "unknown")),
        ("day", lambda e: e.get("timestamp", "unknown")[:10]),
    ):
        grouped = defaultdict(list)
        for entry in entries:
            grouped[get_key(entry)].append(entry)
        groups[key_name] = {key: _summary(value) for key, value in sorted(grouped.items())}
    return {"note": "Costs are estimates from the checked-in Gemini price table; missing prices are unknown.",
            "overall": _summary(entries), **groups}


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if argv == ["report"]:
        print(json.dumps(report(), indent=2, sort_keys=True))
        return 0
    print("Usage: python3 tools/gemini_usage.py report", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
