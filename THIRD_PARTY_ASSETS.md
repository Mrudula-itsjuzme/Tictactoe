# Third-party reference and asset inventory

Reviewed: 2026-10-31

## Source-code references

These repositories informed the design review of the in-repository fighting engine. **No source files, sprites, sound files or footage were copied or bundled from them.** The updated `fight-engine.js` is an original implementation.

| Repository | License stated by upstream | What was studied | Copied? |
| --- | --- | --- | --- |
| [mgechev/mk.js](https://github.com/mgechev/mk.js) | MIT | Combat lifecycle, attack callbacks, game state cleanup | No |
| [leogama09/JavaScript-Fighting-Game](https://github.com/leogama09/JavaScript-Fighting-Game) | MIT | Browser fighter controls, Canvas hit testing concepts | No |
| [phantekzy/js-fight-game](https://github.com/phantekzy/js-fight-game) | MIT | Health bars, attack feedback, match end presentation | No |

**Licensing note:** Repository MIT licenses generally apply to source code, but third-party assets can have distinct terms. No upstream assets were imported, so no copied-code notice or third-party game-art redistribution permission is currently needed. If upstream code/assets are imported later, verify the exact revisions and include required copyright notices and license texts.

## Locally authored visual and gameplay content

- `fight-engine.js`: original fixed-step combat simulation and AI.
- `fight-engine.css`: original CSS fighter construction, arena art and effects.
- `court-drama.js` / `court-drama.css`: original court scenes.
- `assets/judge-gridlock.svg` and `assets/counsel-os.svg`: original illustrations.
- `index.html`: original game UI and fictional archive.

No YouTube clips, commercial character sprites, unlicensed music or external runtime packages are required.

## Future redistribution checks

If external game sprites, audio, fonts or videos are introduced, add title, author, canonical URL, source commit/version, precise license, attribution, edits and any restrictions before publishing.
