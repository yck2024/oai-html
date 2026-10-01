'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('number-only TTS direction is scoped to number clips, not existing narration', () => {
  // Exercise the real generator with stubbed API/encoding: no credential or paid request.
  const output = execFileSync('python3', ['-B', '-c', `
import contextlib, importlib.util, io, json, os, sys, tempfile
from pathlib import Path
spec = importlib.util.spec_from_file_location('generator', Path('generate_gemini_audio.py'))
generator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)
captured = []
def capture(key, text, config, language, clip_id):
    captured.append({'id': clip_id, 'language': language, 'config': config,
                     'original': generator.LANGUAGES[language]})
    return b''
generator.request_wav = capture
generator.encode_mp3 = lambda wav, output: None
generator.time.sleep = lambda delay: None
generator.shutil.which = lambda name: '/stub/ffmpeg'
generator.selected_clips = lambda *args: [
    (language, clip, 'test') for language in ['en', 'zh', 'ja']
    for clip in ['math-1-1', 'math2-bigger', 'word-animals-cat', 'word-number-7']
]
os.environ['GEMINI_JOHN_API_KEY'] = 'test-only-not-a-real-key'
sys.argv = ['generator', '--confirm']
with tempfile.TemporaryDirectory() as directory:
    generator.AUDIO_DIR = Path(directory)
    with contextlib.redirect_stdout(io.StringIO()): generator.main()
print(json.dumps(captured))
`], { cwd: __dirname, encoding: 'utf8' });
  const captured = JSON.parse(output);
  assert.equal(captured.length, 12);
  for (const clip of captured) {
    assert.equal(clip.config.voice, clip.original.voice);
    assert.equal(clip.config.locale, clip.original.locale);
    if (clip.id.startsWith('word-number-')) {
      assert.ok(clip.config.style.startsWith(clip.original.style));
      assert.match(clip.config.style, /exactly and only the supplied number word/);
      assert.match(clip.config.style, /Do not add counters, units, suffixes, particles, or other words/);
    } else assert.deepEqual(clip.config, clip.original, `${clip.id} keeps its original direction`);
  }
});
