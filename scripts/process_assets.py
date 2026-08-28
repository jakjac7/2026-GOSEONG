"""Create traceable, non-destructive game crops from the provided source sheets."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "public" / "assets" / "raw"
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


CROPS = (
    AssetCrop("bg-church-arrival", "1787903081073.png", (0, 0, 1264, 848), "bg-church-arrival.webp", "D1 arrival / D4 cleanup", resize_width=960),
    AssetCrop("bg-threshold", "1787903096675.png", (0, 0, 1264, 848), "bg-threshold.webp", "D3-02 door reveal", resize_width=960),
    AssetCrop("bg-ajayin", "1787903113266.png", (0, 0, 1264, 848), "bg-ajayin.webp", "D2 church repair", resize_width=960),
    AssetCrop("bg-village-feast", "1787903999548.png", (0, 0, 1552, 688), "bg-village-feast.webp", "D3-03 feast", resize_width=1120),
    AssetCrop("bg-observatory", "1787883479147.png", (1055, 32, 1355, 273), "bg-observatory.webp", "D4 observatory", resize_width=960),
    AssetCrop("church-interior", "1787883511363.png", (10, 245, 610, 940), "church-interior.webp", "D1 worship / D2 prayer", resize_width=760),
    AssetCrop("bus", "1787883500341.png", (18, 205, 286, 326), "bus.webp", "D1 / D4 travel sticker", resize_width=520),
    AssetCrop("tents", "1787883500341.png", (895, 25, 1360, 224), "tents.webp", "D1 tent setup", resize_width=760),
    AssetCrop("brick-truck", "1787883505030.png", (770, 345, 1120, 585), "brick-truck.webp", "D2 brick work", resize_width=700),
    AssetCrop("bricks", "1787883510115.png", (790, 690, 1264, 843), "bricks.webp", "D2 brick work detail", resize_width=760),
    AssetCrop("prayer-team", "1787883511320.png", (785, 205, 1364, 390), "prayer-team.webp", "D1 / D2 prayer", resize_width=820),
    AssetCrop("elders", "1787883500341.png", (455, 555, 960, 746), "elders.webp", "D3 pickup / welcome", resize_width=820),
    AssetCrop("elder-yellow", "1787883500341.png", (468, 565, 555, 746), "elder-yellow.webp", "D3-02 first entrant", resize_width=210),
    AssetCrop("elder-gray", "1787883500341.png", (555, 560, 645, 746), "elder-gray.webp", "D3-02 second entrant", resize_width=210),
    AssetCrop("elder-hat", "1787883500341.png", (710, 555, 805, 746), "elder-hat.webp", "D3-02 third entrant", resize_width=210),
    AssetCrop("meal-table", "1787883500341.png", (570, 350, 840, 555), "meal-table.webp", "D2 food prep / D3 meal", resize_width=600),
    AssetCrop("feast-stage", "1787883501759.png", (915, 155, 1364, 620), "feast-stage.webp", "D3 singing vignette", resize_width=680),
    AssetCrop("door-prop", "1787883510115.png", (675, 20, 925, 365), "door-prop.webp", "D2 door-to-door motif", resize_width=520),
    AssetCrop("observatory-church", "1787883479147.png", (10, 22, 345, 278), "observatory-church.webp", "D4 memory card", resize_width=600),
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
    data["note"] = "Source-sheet grid may remain visible; crop is presented as a memory-card/sticker, not a transparent sprite."
    return data


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = [process(crop) for crop in CROPS]
    (OUTPUT / "asset-manifest.json").write_text(
        json.dumps({"version": 1, "assets": manifest}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Processed {len(manifest)} assets into {OUTPUT}")


if __name__ == "__main__":
    main()
