# LumaKeys — missing image files

The four artboards for this project were shared in the chat as images, not as
files, so they could not be converted here. Export them from Illustrator as
**.webp** with these exact names and drop them into this folder — nothing else
needs changing, `project.json` already points at them:

| File             | Artboard                                              |
|------------------|-------------------------------------------------------|
| `hero.webp`      | Purple brand board with the mark + "LumaKeys" wordmark |
| `detail-01.webp` | Mark in black on light / white on dark (split board)   |
| `detail-02.webp` | Lockup with clearspace and construction guides         |
| `detail-03.webp` | App icon + browser window with the favicon             |

`hero.webp` is also the card thumbnail on the work page.

Then run:

    node build-projects.js
