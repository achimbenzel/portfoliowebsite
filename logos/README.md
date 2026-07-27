# Ready-made logo designs

One folder per logo, same shape as `/projects`. Each folder holds a `logo.json`
and its images; `node build-logos.js` flattens them into `logos-data.js`, which
both the client and the server read.

```
logos/
  n-monogram/
    logo.json
    hero.webp        ← card thumbnail + first image on the detail page
    detail-01.webp
    detail-02.webp
```

## logo.json

| Field | Meaning |
|---|---|
| `slug` | URL segment — the page is `/de/shop/<slug>` |
| `order` | Sort order in the listing, lower first (default 999) |
| `categories` | What kind of item it is, e.g. `["logo"]`. The shop lists everything; pages outside the shop filter on this — the branding page only shows `logo`. Omit it and the item appears in the shop alone. |
| `price` | Shown verbatim on the card and the detail page, e.g. `"450 €"` |
| `status` | `available` or `sold`. A sold logo stays listed, greyed out, with the enquiry button disabled |
| `color` | Card tint, used as the fallback while an image is missing |
| `thumbnail` | Card image; defaults to the first entry in `images` |
| `images` | Every image on the detail page, in order. Either `"file.webp"` or `{src, alt:{en,de}}` |
| `en` / `de` | `name`, `tagline`, `description`, `tags[]`, `includes[]` |

After adding or changing a folder:

```
node build-logos.js
```

## n-monogram — images still needed

The placeholder entry expects these three files in `logos/n-monogram/`:

| File | Shown as |
|---|---|
| `hero.webp` | thumbnail in the listing + first image on the detail page |
| `detail-01.webp` | the mark in one colour, light and dark |
| `detail-02.webp` | the mark in use (app icon, favicon) |

Until they exist those three URLs 404 and the page falls back to a plain tinted
placeholder — the listing and the detail page work either way. The alt texts in
`logo.json` describe the intended images; adjust them if the artwork differs.

Prices here are placeholders and are deliberately kept out of the JSON-LD, so
nothing quotable is published as structured data before the real figures are set.
