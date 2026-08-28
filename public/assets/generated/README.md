# Generated transparent assets

These PNG masters were created with the built-in OpenAI image generation tool on 2026-08-29. The provided source sheets were used only as visual-style references. `scripts/process_assets.py` trims their alpha bounds and creates the optimized WebP files consumed by the game.

| File                  | Final prompt summary                                                                                                              | Usage                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `travel-bus.png`      | White and navy Korean church-team charter bus, crisp pixel art, isolated transparent background                                   | DAY 1 outbound / DAY 4 return    |
| `pickup-suv-1004.png` | White midsize SUV with license plate text exactly `1004`, isolated transparent background                                         | DAY 3 elder pickup only          |
| `elders-group.png`    | Three dignified elderly Korean villagers in distinct everyday outfits, full-body pixel-art group, transparent background          | Pickup, threshold, welcome       |
| `prayer-team.png`     | Five Korean outreach volunteers praying together, full-body pixel-art group, transparent background                               | Opening worship and DAY 2 prayer |
| `meal-prep-team.png`  | Six volunteers gathered around a table filling whole chickens with rice and garlic, non-graphic pixel art, transparent background | DAY 2 meal preparation           |

Constraints shared by every prompt: clean alpha edges; no grid or card frame; no scenery; no watermark; no cropped subjects; match the warm outlined pixel-art language of the supplied reference sheets.
