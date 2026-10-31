# TIC TAC HELL ☠️

**A tic-tac-toe game that holds a grudge.** A polished, zero-dependency browser game with a genuinely fair mode and a chaotic narrative mode, plus the original Java Swing desktop edition.

![JavaScript](https://img.shields.io/badge/browser-vanilla%20JS-60e6e0) ![Java](https://img.shields.io/badge/desktop-Java%2011%2B-ff6caa) ![MIT](https://img.shields.io/badge/license-MIT-blue)

## Play

**Browser edition:** Open `index.html` in any modern browser. No installation, account, server, build step, dependencies, or telemetry required. After deploying, the Vercel URL works on desktop and mobile.

For local development, you can also use:

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

**Original Java Swing edition:**

```bash
javac -d out src/TicTacHell.java
java -cp out TicTacHell
```

The Java edition requires Java 11 or newer, a graphical desktop, and is **not** executed by Vercel. The browser version is a separate implementation, preserving the desktop source.

## Game modes

| Mode | Rules | What makes it interesting |
| --- | --- | --- |
| **Fair play** | 3×3; first three in a row wins | Proper win/draw detection; AI never loses across all personalities |
| **Hell** | Starts 3×3, grows to at most 10×10; five in a row on larger boards | The AI cheats; each offense leaves evidence, and successful prosecutions block future cheats |

### Opponents

- **Chill (still unbeatable):** relaxed commentary, but only optimal moves.
- **Clever (still unbeatable):** sharper taunts, and the same perfect strategy.
- **Merciless (unbeatable):** relentless taunts and perfect-play minimax.

**All three personalities use perfect-play minimax with alpha-beta pruning.** They differ in attitude, never in playing strength. The human can at best draw when playing perfectly.

The AI moves second. It never overwrites occupied squares in fair mode. Hell mode is **deliberately unfair** and does not promise the normal win conditions. Hell mode escalates through deterministic chapters, and every cheating attempt produces a recorded exhibit. Prosecuting an exhibit requires selecting the correct charge; each guilty verdict awards two single-use protective injunctions. Three guilty verdicts, five clues, and the 10×10 board unlock the final terminal ending.

## Hidden story

Hell mode contains sealed transcripts, an evidence-based courtroom, a fictional terminal, and two endings. The website intentionally avoids a tutorial or a complete solution. Explore the incident log and case dossier to discover what the machine is hiding.



## Experience

- Responsive layout for phones, tablets and desktops.
- Click or keyboard-activate square buttons; descriptive accessible labels, focus indicators, and live status messages.
- Scoreboard, opponent personality, mode and optional sound effects persisted in browser local storage.
- An immersive courtroom with character roles, legal charges, physical evidence, cross-examination, jury credibility/bias meters, theatrical verdicts and actual protective injunctions.
- The game preserves pending evidence if you exit court before a verdict. An incorrect prosecution consumes the exhibit, while a guilty verdict rewards you with two future cheat blocks.
- Reduced-motion preference respected; audio disabled by default.
- No external JavaScript, trackers, accounts, cookies or API keys.
- Restart the round or reset the scoreboard at any time.

## Structure

```text
Tictactoe/
├── index.html             # Browser game, state and unbeatable AI
├── court-drama.js         # Cinematic court state machine and branching dialogues
├── court-drama.css        # Cinematic scenes, motion and character styling
├── assets/
│   ├── judge-gridlock.svg # Original Judge portrait
│   └── counsel-os.svg     # Original defense portrait
├── src/
│   └── TicTacHell.java    # Original Swing desktop game
├── LICENSE                # MIT
└── README.md
```

## Deployment

This is a static HTML site. To deploy on Vercel, import this GitHub repository, select **Other / no framework**, leave the root directory as `./`, and disable unnecessary build commands. The entry point is the root `index.html`. No environment variables are required.

## Development notes

All fair-mode opponents use minimax over the nine-cell game tree. Scores reward faster wins and slower defeats. Alpha-beta pruning eliminates branches that cannot change the best decision. Hell mode deliberately uses different game logic and sometimes violates fair-play rules.

## Contributing and safety

Small UI, accessibility, gameplay or narrative improvements are welcome. Please do not commit credentials, stolen assets, or unlicensed third-party content. This game is entirely fictional and does not interact with OS settings or execute user-entered commands.

## License

MIT. See [LICENSE](LICENSE). Original project by [Mrudula Pedamallu](https://github.com/Mrudula-itsjuzme).

## Courtroom implementation

Court scenes run locally in `court-drama.js` and `court-drama.css` with original locally stored SVG character art. No external fonts, video embeds, libraries or server requests are required. Entering the courtroom traps keyboard focus within the scene, while Escape or the Exit button postpones a hearing before its verdict. Reduced-motion preferences are supported. The dramatic scenes are intentionally fictional.

## Cinematic media and rights

The courtroom now features **original anime-inspired vector character art**, full-screen title cutscenes, stylized camera punches, manga speed lines, shifting crimson/gold spotlights, objection slams, and theatrical verdict sequences. The motion graphics are rendered directly in the browser with CSS and JavaScript rather than downloaded movie or anime footage. No third-party YouTube media was copied, scraped, or embedded. The included illustrated SVGs and animations are original source assets distributed under this repository's MIT license.

Why no random YouTube movie clips? YouTube's standard license and platform terms do not automatically authorize copying, editing, or rehosting footage in a game. If licensed CC BY or rights-holder-approved videos are added later, preserve author, title, source URL, exact license, modification notes and any distribution restrictions in a media attribution manifest. The game does not need third-party footage to function.

Animation respects the user's reduced-motion preference. Sound effects are synthesized locally with Web Audio and remain optional.

## Sitewide motion system

The 2026 cinematic polish pass extends animations beyond the courtroom: new player and AI marks receive distinct pop-in effects, new board dimensions and blocked cheats trigger board reactions, updated scores pulse, status messages and incident-log entries animate, the settings and story controls respond to interaction, and dialog windows animate into view. The courtroom's full-screen cut-in typography now wraps and scales within narrow and short viewports rather than overflowing the screen. Repeated board redraws do not reanimate old marks.

Animations are CSS/JavaScript-driven, with no external video assets or animation dependencies. Reduced-motion settings disable nonessential effects. All existing gameplay logic and the original Java desktop edition remain intact.

## 2026-10-31 gameplay revisions

The public help walkthrough was removed to preserve discovery. Hell-mode board expansion is scheduled through the cheat progression instead of left entirely to chance; its AI prioritizes blocking immediate threats. The story releases sealed transcripts more quickly and gives increasingly cryptic hints through the case dossier and terminal. Court sanctions, evidence trials and the two endings are preserved. Fair mode retains non-losing minimax AI across all three personalities.

## Arcade UI redesign (October 2026)

The web edition now uses a completely reworked arcade-inspired layout: bold title treatment, central game arena with patterned stage and oversize board, a control room for mode/personality/audio, and a separate Dark Archive for courtroom, terminal, alerts and dossier. The redesign stays responsive, keeps all existing control IDs and game mechanics, uses only original CSS and in-repository artwork, and respects reduced-motion preferences. The entry point remains `index.html`; visual overrides live in `arcade.css`.

## Title screen and fullscreen game (October 2026)

The browser experience opens on a separate cinematic title screen. Choose **Enter the Game** to transition into a compact gameplay view using a CSS wipe. The **Title Screen** control returns to the opening screen without resetting the current game. On desktop, the game board, controls and case archive occupy a viewport-height layout with the transmission log scrolling independently. Smaller screens reflow responsively to keep controls reachable. The transition and animated splash honor reduced-motion preferences. Implemented in `two-screen.css` and `index.html` without additional dependencies.

## Natural opening and native screen transitions

Hell mode now responds to each player move with an ordinary O move. The first four turns are deliberately conventional before cheat incidents begin escalating; later cheat incidents are layered on top of the normal reply. Native browser View Transitions animate the title/game switch where supported, with a simple fallback elsewhere. No third-party transition template, dependency, or additional license is required. The 10×10 grid has explicit rows and constrained cell sizes to avoid overflowing the arena.

## v4: Board-first arcade and trial combat

The desktop game now gives the board approximately 70% of the width; the right sidebar becomes **Control**, **Archive**, and **Log** tabs. The marquee and footer are removed during gameplay, and the 10×10 board scales inside the arena. Small screens keep the board first and allow vertical scrolling so controls remain reachable.

**Scoring:** In Hell mode, a legitimate three-in-a-row on a 3×3 grid (or the corresponding line on expanded boards) immediately earns a human point even if the machine subsequently cheats. Identical completed lines are counted only once per round. The story continues after a point, allowing both progress and narrative interference. Fair-mode win/loss/draw scoring is unchanged.

**Courtroom battle:** After charge, evidence, and rebuttal phases, a fighter-style duel begins against Defense Counsel O.S. Levels increase with convictions, HP is visible, and the rival telegraphs STRIKE, HEAVY, or GUARD. **This is now a real-time keyboard-controlled fight, not a menu-based battle.** The player moves, jumps, attacks, blocks and dodges against an enemy that pursues, telegraphs strikes, adapts to blocking, and changes defensive behavior with health. A guilty verdict requires both successful evidence and a duel victory. Combat visuals are original CSS silhouettes, not footage or third-party animation packs.

The terminal, dossier and alert also have distinctive transitions. Motion respects the reduced-motion setting. No new CI, build dependencies or external assets were added.

## Delayed erasure and machine tantrums

Hell mode renders each newly placed X before the machine takes its turn. Any illegal erasure is announced and animated on the occupied square before removal, preserving the visual cause-and-effect of the move. A human score is retained even if the machine retaliates. Winning triggers an original full-screen machine tantrum cutscene, followed by its response and potential rule-breaking. Timed responses are invalidated when a round resets, and reduced-motion preferences are respected.

## Real-time courtroom fighting controls (v5)

The courtroom's legal accusation, evidence and cross-examination sequence leads to an actual playable arena. After the cinematic introduction, use these controls:

| Key | Action |
| --- | --- |
| **A / D** or **Left / Right arrows** | Move sideways |
| **W** or **Up arrow** | Jump |
| **J** | Fast attack |
| **K** | Heavy attack that breaks guard |
| **L (hold)** | Block incoming damage |
| **Space** | Dodge with a short invulnerability window |
| **P** | Pause / resume |
| **Esc** | Leave the court (forfeits an unfinished duel) |

On touchscreens, the arena exposes on-screen controls. The enemy has real health, animated hits, attack wind-ups, a pursuit state, and adaptive action selection. Increasing trial levels increase enemy HP and damage. The combat is an original lightweight 2D game engine; it uses no external fighting-game assets, copyrighted footage or third-party runtime libraries.

**Hell-mode AI update:** The opening 3×3 board uses perfect minimax. Later boards use five-in-a-row threat detection and spatial positional scoring. Completed O lines are credited to the machine rather than triggering unexplained deletion of X marks. The player also retains all earned points after a tantrum. Illegal X removal locks player input until the erasure animation completes.

This is an experimental browser game: source syntax and deployment can be checked automatically, but fight balancing and full controller behavior require an interactive browser playtest.

## Hidden-reveal gameplay (October 2026)

Hell mode now deliberately begins as ordinary 3×3 tic-tac-toe with the same perfect-play opening as Fair mode. The first serious player threat after at least three X moves reveals the machine's secret: a cinematic tantrum followed by a visible, staggered **X-to-O conversion**. The original board is displayed before any transformation, and the machine doesn't flood it with O marks beforehand. The takeover itself creates a courtroom exhibit and can expand the board, after which AI play and later rule-breaking resume. Stolen X marks are not counted as legitimate machine victories; a completed player line still earns its human point before the theft. Timers are guarded by round session IDs to prevent old cutscenes editing a restarted round. This is a fictional, intentional rule change, not standard tic-tac-toe gameplay.

## Courtroom art and score corrections (v6)

The AI's first three-in-a-row now credits a machine point during the normal 3×3 minimax opening. Later, each newly completed O line is counted once, while the fictional X-to-O takeover still does not grant unearned machine points. The real-time courtroom battle now uses original articulated HTML/CSS characters with separate head, torso, limbs and facial details; walking legs, strike/heavy punch poses, hit sparks, and combo announcements make combat actions more legible. These are original in-repository effects, not copyrighted footage or commercial sprites.

## Consistent score rule (October 31, 2026)

A line of **three consecutive Xs or Os** scores on every board size, including expanded 5×5 through 10×10 boards. The prior five-in-a-row threshold after expansion was inconsistent with the opening rules and has been removed. Threat detection, human-win triggers and the AI's scoring use the same three-in-a-row target. Each completed three-cell line is credited at most once per round. Stolen marks from the initial corruption reveal cannot generate unearned machine points.
