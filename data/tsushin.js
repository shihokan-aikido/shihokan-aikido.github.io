/* =========================================================
   志鵬館通信の一覧データ
   ・新しい号を出すときは：
     1) この下に { } を1つ足す
     2) tsushin/ フォルダに no06.html のように1ページ足す（no05.html をまねてつくる）
   ・date  : "2025.01.28" の形
   ・page  : その号のページ（サイトのいちばん上から見た場所）
   ・pdf   : 元の紙面PDFと、その号が載っているページ番号
   ・parts : 同じページにいっしょに載せている記事（添付など）
   ・kk    : 任意。号数などがはっきりしないときのメモ（「要確認」の札で出ます）
   ・表示は日付の新しい順（同じ日付なら、ここに書いた順の逆＝下に書いたものが上）
   ========================================================= */
window.SHIHOKAN_TSUSHIN = [
  {
    no: "No.1", date: "2024.10.21",
    title: "はじめに", titleEn: "Introduction",
    page: "tsushin/no01.html",
    pdf: "assets/pdf/shihokan-tsushin_no1-5.pdf", pdfPages: [3]
  },
  {
    no: "No.2", date: "2024.10.21",
    title: "正勝吾勝（まさかつあがつ）", titleEn: "Masakatsu Agatsu",
    page: "tsushin/no02.html",
    pdf: "assets/pdf/shihokan-tsushin_no1-5.pdf", pdfPages: [2]
  },
  {
    no: "No.3", date: "2024.12.17",
    title: "武産合気（たけむすあいき）", titleEn: "Takemusu Aiki",
    page: "tsushin/no03.html",
    pdf: "assets/pdf/shihokan-tsushin_no1-5.pdf", pdfPages: [1],
    kk: "紙面に号数の記載なし（No.3と思われる）"
  },
  {
    no: "No.4", date: "2025.01.28",
    title: "合気と人作り", titleEn: "Aiki and Building People",
    page: "tsushin/no04.html",
    pdf: "assets/pdf/shihokan-tsushin_no1-5.pdf", pdfPages: [4, 5],
    parts: [{ title: "合気道倫理憲章", titleEn: "Aikido Ethics Charter" }],
    kk: "倫理憲章のページはNo.4の添付と思われる"
  },
  {
    no: "No.5", date: "2025.01.28",
    title: "身体・健康に与える変化―1", titleEn: "Changes to Body and Health – 1",
    page: "tsushin/no05.html",
    pdf: "assets/pdf/shihokan-tsushin_no1-5.pdf", pdfPages: [6, 7],
    parts: [{ title: "身体・健康に与える変化―2", titleEn: "Changes to Body and Health – 2" }],
    kk: "紙面の手書きは「N.5」。―2 はNo.5の続きと思われる（号数・日付の記載なし）"
  }
];
