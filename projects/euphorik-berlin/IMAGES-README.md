# Euphorik Berlin — placeholder images

The four `.webp` files in this folder are **copies of the LumaKeys artboards**,
used as placeholders until the real Euphorik Berlin artwork is exported. The
copy in `project.json` already describes the Euphorik design, so only the
images need replacing — drop the real files in under the same names and the
page picks them up.

| File | Shown as |
|---|---|
| `hero.webp` | thumbnail on the work grid + first image on the project page |
| `detail-01.webp` | mark in one colour, light and dark |
| `detail-02.webp` | lockup with clearspace / construction |
| `detail-03.webp` | the mark in use (avatar, cover artwork) |

After replacing them, run:

```
node build-projects.js
```

The alt texts in `project.json` describe the intended Euphorik images, not the
LumaKeys placeholders — adjust them if the final artwork shows something else.
