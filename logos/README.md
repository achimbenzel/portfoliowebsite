# Ready-made logo designs

One folder per logo, same shape as `/projects`. Each folder holds a `logo.json`
and its images; `node build-logos.js` flattens them into `logos-data.js`, which
both the client and the server read.

```
logos/
  n-monogram/
    logo.json
    hero.webp        ← card thumbnail + first image on the detail page
    detail-01.webp   ← also shown on the card on hover (in place of a zoom)
    detail-02.webp
    detail-03.webp
    N.svg            ← flat single-colour mark; 2nd gallery image + logo tester
```

Each logo ships five images: `hero`, `detail-01…03` and the flat `.svg` mark.

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
| `svg` | Flat single-colour `.svg` mark. Powers the on-page logo tester and, when listed in `images`, the last gallery tile. It is pure black, so it is recoloured for dark grounds automatically. |
| `images` | Every image on the detail page, in order. Either `"file.webp"` or `{src, alt:{en,de}}`. List the `.svg` mark second, right after the hero, so the tester's artwork leads the gallery |
| `en` / `de` | `name`, `tagline`, `description`, `tags[]`, `includes[]` |

After adding or changing a folder:

```
node build-logos.js
```

## Placeholder copy — still to rewrite

`n-monogram` has its real artwork and copy. `cyber-circle`, `flower-symbol` and
`x-monogramm` now carry their five images and their `.svg` mark, but the names,
taglines and descriptions in their `logo.json` are still placeholder copy —
rewrite them to match each real mark. Run `node build-logos.js` after any change.

If an image URL 404s, the card and stage fall back to a plain tinted placeholder
(the `color` field sets the tint), so the listing and detail page work either way.

Prices here are placeholders and are deliberately kept out of the JSON-LD, so
nothing quotable is published as structured data before the real figures are set.
