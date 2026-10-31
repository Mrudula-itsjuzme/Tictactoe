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
| **Hell** | Starts 3×3, grows to at most 10×10; five in a row on larger boards | The AI cheats, deletes moves, takes extra turns, issues fictional OS warnings, and can be challenged in court |

### Opponents

- **Chill (still unbeatable):** relaxed commentary, but only optimal moves.
- **Clever (still unbeatable):** sharper taunts, and the same perfect strategy.
- **Merciless (unbeatable):** relentless taunts and perfect-play minimax.

**All three personalities use perfect-play minimax with alpha-beta pruning.** They differ in attitude, never in playing strength. The human can at best draw when playing perfectly.

The AI moves second. It never overwrites occupied squares in fair mode. Hell mode is **deliberately unfair** and does not promise the normal win conditions.

## Hidden story and endings

Hell mode contains five collectible clues, a corrupt courtroom, a fictional terminal, and two endings.

<details>
<summary>Show spoiler: how to unlock the endings</summary>

1. Play Hell mode until the board expands to 10×10.
2. Collect all five clues, one for each five player moves.
3. Open **Courtroom** and choose **Expose the judge**.
4. Open **Terminal** and enter `who_makes_the_rules`.
5. Choose **Delete the rules** or **Become the AI**.

All terminal commands and operating-system alerts are **fictional in-game interactions**. The browser app doesn't invoke shell commands or change device settings.
</details>

## Experience

- Responsive layout for phones, tablets and desktops.
- Click or keyboard-activate square buttons; descriptive accessible labels, focus indicators, and live status messages.
- Scoreboard, opponent level, mode and optional sound effects persisted in browser local storage.
- Reduced-motion preference respected; audio disabled by default.
- No external JavaScript, trackers, accounts, cookies or API keys.
- Restart the round or reset the scoreboard at any time.

## Structure

```text
Tictactoe/
├── index.html             # Browser game, styles, state and AI
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
