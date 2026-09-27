// Series configuration for taiwan-ehon. This is the single place that carries this
// series' identity: its own URL folder, PWA scope, GA series_id, shelf/reader copy, and which
// languages it offers. The shared engine (../engine/) reads only this file to behave as
// taiwan-ehon; every value here reproduces the app's original, pre-refactor behavior exactly —
// see the taiwan-ehon README for the URL-stability guarantee this file exists to protect.

const SERIES = {
  id: "taiwan",
  folder: "taiwan-ehon",
  basePath: "/oai-html/taiwan-ehon/",
  shelfMarker: "/taiwan-ehon/",
  shelfPageTitle: "Taiwan story picture books",
  shelfDocumentTitle: "台灣故事繪本｜たいわんの おはなし えほん",
  siteNameSuffix: " · 台灣故事繪本",
  hint: "▶ を おすと よむよ。 ぶんを タップしても きけるよ。 · 按 ▶ 唸給你聽，也可以點句子喔。",
  unavailable: "こえが でません。 ぶんは よめるよ。 · 目前無法播放聲音，還是可以看故事喔。",
  languages: [
    "ja",
    "zh"
  ],
  languageNames: {
    ja: "にほんご",
    zh: "中文"
  },
  defaultMode: "ja-zh",
  narratedOnlyToggle: false,
  narratedOnlyLabel: ""
};

(function (root, config) {
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.EhonSeriesConfig = config;
})(typeof self !== 'undefined' ? self : this, SERIES);
