# Generated transparent assets

These PNG masters were created with the built-in OpenAI image generation tool on 2026-08-29. The provided source sheets were used only as visual-style references. `scripts/process_assets.py` trims their alpha bounds and creates the optimized WebP files consumed by the game.

| File                            | Final prompt summary                                                                                                              | Usage                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `travel-bus.png`                | White and navy Korean church-team charter bus, crisp pixel art, isolated transparent background                                   | DAY 1 outbound / DAY 4 return                     |
| `pickup-suv-1004.png`           | White midsize SUV with license plate text exactly `1004`, isolated transparent background                                         | DAY 3 elder pickup only                           |
| `elders-group.png`              | Three dignified elderly Korean villagers in distinct everyday outfits, full-body pixel-art group, transparent background          | Pickup, threshold, welcome                        |
| `prayer-team.png`               | Five Korean outreach volunteers praying together, full-body pixel-art group, transparent background                               | Opening worship and DAY 2 prayer                  |
| `meal-prep-team.png`            | Six volunteers gathered around a table filling whole chickens with rice and garlic, non-graphic pixel art, transparent background | DAY 2 meal preparation                            |
| `canopy-tent.png`               | One complete white outdoor pop-up canopy, isolated true-alpha pixel-art sprite                                                    | DAY 1 tent setup / DAY 4 cleanup                  |
| `brick-truck-loaded.png`        | White Korean 1-ton flatbed truck facing right, visibly loaded with stacked red bricks, true-alpha pixel-art sprite                | DAY 2 brick transport                             |
| `observatory-church-cutout.png` | Complete small coastal observatory chapel with cross, reconstructed from the cropped facade as a true-alpha pixel-art building    | DAY 4 observatory                                 |
| `church-interior-open.png`      | Red-brick sanctuary redrawn as a full 4:3 background with every chair removed and an open foreground floor                        | DAY 1 worship / DAY 2 meal preparation and prayer |
| `outreach-volunteers-v2.png`    | Two young Korean volunteers with invitation and tote bag, matched to the existing warm outlined pixel-art character style         | DAY 1 campus / DAY 2 village outreach             |
| `international-students-v2.png` | Three international university students with varied skin tones and campus bags, matched to the same pixel-art style               | DAY 1 campus outreach                             |

Constraints shared by every prompt: clean alpha edges; no grid or card frame; no scenery; no watermark; no cropped subjects; match the warm outlined pixel-art language of the supplied reference sheets.
