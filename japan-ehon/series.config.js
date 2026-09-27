// Series configuration for japan-ehon. This is the single place that carries this series'
// identity: its own URL folder, PWA scope, GA series_id, shelf/reader copy, and which
// languages it offers. The shared engine (../engine/) reads only this file to behave as
// japan-ehon. Unlike taiwan-ehon, this series opts into a third language (en) and the
// "show only the narrated language" toggle — see the japan-ehon README for how those two
// features actually behave, and taiwan-ehon/README.md for why taiwan-ehon leaves them off.

const SERIES = {
  id: 'japan',
  folder: 'japan-ehon',
  basePath: '/oai-html/japan-ehon/',
  shelfMarker: '/japan-ehon/',
  shelfPageTitle: 'Japan story picture books',
  shelfDocumentTitle: 'にほんの むかしばなし えほん ・ 日本民間故事繪本',
  siteNameSuffix: ' · にほんの むかしばなし えほん',
  hint: '▶ を おすと よむよ。 ぶんを タップしても きけるよ。 · 按 ▶ 唸給你聽，也可以點句子喔。',
  unavailable: 'こえが でません。 ぶんは よめるよ。 · 目前無法播放聲音，還是可以看故事喔。',
  languages: ['ja', 'zh', 'en'],
  languageNames: { ja: 'にほんご', zh: '中文', en: 'English' },
  defaultMode: 'ja-zh',
  narratedOnlyToggle: true,
  narratedOnlyLabel: 'きいている ことばだけ ひょうじ ・ 只顯示正在聽的語言 ・ Show only the narrated language',
};

(function (root, config) {
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.EhonSeriesConfig = config;
})(typeof self !== 'undefined' ? self : this, SERIES);
