# Math Island

Math Island is a small collection of Japanese, browser-only math games for young children. Choose a game from index.html; each game has a link back to this menu, and the menu links back to the OAI HTML gallery.

## Games

- **Poko and the Star Island** (poko/) — count apples from 1 to 5 and practice addition up to 5 with Poko the fox.
- **Number Garden** (number-garden/) — explore garden, ocean, and space worlds while counting and adding.
- **Rag and the Echo Forest** (dino-spirit/) — help dinosaur Rag and forest spirit Powa collect five lights by solving addition questions.

All three games are static HTML, CSS, JavaScript, and bundled assets. They do not need a server, account, or API key to play. Number Garden stores progress in the browser's local storage. Poko and Rag and the Echo Forest do not upload or save game data.

Open index.html locally to start. Browser storage can behave differently for file pages; for a shareable link and reliable local progress, the games are published under the OAI HTML GitHub Pages gallery. Each visitor's progress remains in that visitor's own browser.

Japanese AivisSpeech voice clips are packaged in the Poko and Number Garden audio folders, so no text or API key is sent to Aivis during play. Credit: **AivisSpeech: まお**. The optional generator in number-garden/generate_aivis_audio.py can recreate Number Garden's clips after you provide a private Aivis API key; it previews the character count, respects a 1,000-character cap, and asks before making requests. Keep API keys out of this public repository.

## Files

- index.html — game chooser and link back to the gallery
- poko/ — original Poko game and its narration clips
- number-garden/ — 3D Number Garden game, assets, and audio generator
- dino-spirit/ — Rag and the Echo Forest, an original addition game with local HTML, CSS, and JavaScript
- THIRD_PARTY_NOTICES.md — library and voice attribution
