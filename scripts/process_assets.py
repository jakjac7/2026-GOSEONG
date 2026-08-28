"""Create traceable, non-destructive game crops from the provided source sheets."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "public" / "assets" / "raw"
GENERATED = ROOT / "public" / "assets" / "generated"
OUTPUT = ROOT / "public" / "assets" / "processed"


@dataclass(frozen=True)
class AssetCrop:
    asset_id: str
    source: str
    rect: tuple[int, int, int, int]
    output: str
    usage: str
    status: str = "ready"
    resize_width: int | None = None


@dataclass(frozen=True)
class GeneratedAsset:
    asset_id: str
    source: str
    output: str
    usage: str
    resize_width: int
    status: str = "ready"


CROPS = (
    AssetCrop("bg-church-arrival", "1787903081073.png", (0, 0, 1264, 848), "bg-church-arrival.webp", "D1 arrival / D4 cleanup", resize_width=960),
    AssetCrop("bg-threshold", "1787903096675.png", (0, 0, 1264, 848), "bg-threshold.webp", "D3-02 door reveal", resize_width=960),
    AssetCrop("bg-ajayin", "1787903113266.png", (0, 0, 1264, 848), "bg-ajayin.webp", "D2 church repair", resize_width=960),
    AssetCrop("bg-village-feast", "1787903999548.png", (0, 0, 1552, 688), "bg-village-feast.webp", "D3-03 feast", resize_width=1120),
    AssetCrop("bg-observatory", "1787883479147.png", (1055, 32, 1355, 273), "bg-observatory.webp", "D4 observatory", resize_width=960),
    AssetCrop("church-interior", "1787883511363.png", (10, 245, 610, 940), "church-interior.webp", "D1 worship / D2 prayer", resize_width=760),
    AssetCrop("tents", "1787883500341.png", (895, 25, 1360, 224), "tents.webp", "D1 tent setup", resize_width=760),
    AssetCrop("brick-truck", "1787883505030.png", (770, 345, 1120, 585), "brick-truck.webp", "D2 brick work", resize_width=700),
    AssetCrop("bricks", "1787883510115.png", (790, 690, 1264, 843), "bricks.webp", "D2 brick work detail", resize_width=760),
    AssetCrop("door-prop", "1787883510115.png", (675, 20, 925, 365), "door-prop.webp", "D2 door-to-door motif", resize_width=520),
    AssetCrop("observatory-church", "1787883479147.png", (10, 22, 345, 278), "observatory-church.webp", "D4 memory card", resize_width=600),
)

GENERATED_ASSETS = (
    GeneratedAsset("travel-bus", "travel-bus.png", "travel-bus.webp", "D1 / D4 group travel", 760),
    GeneratedAsset("pickup-suv-1004", "pickup-suv-1004.png", "pickup-suv-1004.webp", "D3 elder pickup only", 660),
    GeneratedAsset("elders-group", "elders-group.png", "elders-group.webp", "D3 pickup / threshold / welcome", 460),
    GeneratedAsset("prayer-team", "prayer-team.png", "prayer-team.webp", "D1 opening worship / D2 prayer", 760),
    GeneratedAsset("meal-prep-team", "meal-prep-team.png", "meal-prep-team.webp", "D2 sanctuary meal preparation", 860),
)


def process(crop: AssetCrop) -> dict[str, object]:
    source_path = RAW / crop.source
    if not source_path.exists():
        raise FileNotFoundError(f"Missing source asset: {source_path}")

    with Image.open(source_path) as source:
        image = source.convert("RGB").crop(crop.rect)
        if crop.resize_width and image.width != crop.resize_width:
            height = round(image.height * crop.resize_width / image.width)
            image = image.resize((crop.resize_width, height), Image.Resampling.NEAREST)
        destination = OUTPUT / crop.output
        image.save(destination, "WEBP", quality=88, method=6)

    data = asdict(crop)
    data["rect"] = {"x": crop.rect[0], "y": crop.rect[1], "w": crop.rect[2] - crop.rect[0], "h": crop.rect[3] - crop.rect[1]}
    data["source_kind"] = "provided"
    data["note"] = "Source-sheet grid may remain visible; crop is presented as a memory-card/sticker, not a transparent sprite."
    return data


def process_generated(asset: GeneratedAsset) -> dict[str, object]:
    source_path = GENERATED / asset.source
    if not source_path.exists():
        raise FileNotFoundError(f"Missing generated asset: {source_path}")

    with Image.open(source_path) as source:
        image = source.convert("RGBA")
        alpha_bounds = image.getchannel("A").getbbox()
        if alpha_bounds:
            image = image.crop(alpha_bounds)
        if image.width != asset.resize_width:
            height = round(image.height * asset.resize_width / image.width)
            image = image.resize((asset.resize_width, height), Image.Resampling.LANCZOS)
        destination = OUTPUT / asset.output
        image.save(destination, "WEBP", quality=90, method=6)

    data = asdict(asset)
    data["source"] = f"generated/{asset.source}"
    data["source_kind"] = "openai-imagegen"
    data["operation"] = "alpha-trim + resize"
    data["note"] = "Original transparent PNG is preserved in public/assets/generated."
    return data


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stale_asset in OUTPUT.glob("*.webp"):
        stale_asset.unlink()
    manifest = [process(crop) for crop in CROPS]
    manifest.extend(process_generated(asset) for asset in GENERATED_ASSETS)
    (OUTPUT / "asset-manifest.json").write_text(
        json.dumps({"version": 2, "assets": manifest}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Processed {len(manifest)} assets into {OUTPUT}")


if __name__ == "__main__":
    main()
