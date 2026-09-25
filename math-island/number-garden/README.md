# Number Garden

A browser-only 3D math game for early learners. It has no server code, build step, account, or API key in the game files. Three.js and Japanese Aivis voice clips are included locally. When hosted in the OAI HTML gallery, the page loads the gallery's shared page and button analytics; progress stays in local storage, and answer values are not sent.

## Play

Open `index.html` in a recent browser. Japanese is selected by default, with an English UI switch; narration remains Japanese. The game reads each puzzle, feedback, and completion message aloud using bundled Japanese MP3 clips. Choose a Garden, Ocean, or Space world, then play eight short counting and addition puzzles. Progress is saved in that browser's local storage: total stars, puzzles solved, and the selected world and language. Use **Reset stars** on the opening screen to clear the saved progress.

Local-file storage support varies by browser. For reliable saving and an easy link to share, publish these static files with GitHub Pages. GitHub Pages serves static HTML, CSS, and JavaScript directly from a repository; no app server or build step is needed. In the repository settings, choose **Pages → Deploy from a branch**, then select the branch and root folder. See [GitHub's publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Stars stay in the player's own browser. They are not uploaded or synced to GitHub or another device. Private browsing may clear them when the private session ends.

## Aivis voice clips

The packaged audio is generated once from the text in `generate_aivis_audio.py`; the game never sends text or an API key to Aivis at play time. To regenerate clips, run `python3 generate_aivis_audio.py`. The script reads `AIVIS_API_KEY` from a local `.env` (or the process environment), and asks for it with hidden input if neither is set. It shows the character estimate and asks before sending requests. Keep `.env` private: it is ignored by Git and excluded from the static game bundle. Aivis Cloud API usage may be billed by generated characters; the script defaults to a 1,000-character limit. If using the default voice, include the requested attribution **AivisSpeech: まお**.

## Style previews

Add `?showStyles=1` to the page URL to show a small preview switcher during play. You can load a world directly with `?style=ocean` or `?style=space`.

## Files

- `index.html` — game page
- `style.css` — responsive layout
- `game.js` — game and local-storage logic
- `three.min.js` — bundled Three.js browser library
- `audio/` — bundled Japanese voice clips
- `generate_aivis_audio.py` — optional script for regenerating the clips
- `THIRD_PARTY_NOTICES.md` — library attribution and license
