const fs = require('fs');
const path = require('path');
const { AJANLOTT, INVAZIV, FENNTART, MEDITERRAN } = require('./data.js');

// A publikált oldal címe. Ha változik a GitHub-felhasználónév vagy a repó neve,
// itt kell átírni — a canonical, az og:url és az og:image innen épül fel.
// (Ugyanez a cím szerepel még: README.md, robots.txt, sitemap.xml.)
const SITE_URL = "https://udvariistvan2016-ui.github.io/klimaallo-kert/";

const LIC = {
  "CC BY-SA 4.0":"https://creativecommons.org/licenses/by-sa/4.0/deed.hu",
  "CC BY-SA 3.0":"https://creativecommons.org/licenses/by-sa/3.0/deed.hu",
  "CC BY-SA 3.0 ee":"https://creativecommons.org/licenses/by-sa/3.0/ee/deed.hu",
  "CC BY-SA 2.5":"https://creativecommons.org/licenses/by-sa/2.5/deed.hu",
  "CC BY-SA 2.0":"https://creativecommons.org/licenses/by-sa/2.0/deed.hu",
  "CC BY 4.0":"https://creativecommons.org/licenses/by/4.0/deed.hu",
  "CC BY 3.0":"https://creativecommons.org/licenses/by/3.0/deed.hu",
  "CC BY 3.0 us":"https://creativecommons.org/licenses/by/3.0/us/deed.hu",
  "CC BY 2.5":"https://creativecommons.org/licenses/by/2.5/deed.hu",
  "CC BY 2.0":"https://creativecommons.org/licenses/by/2.0/deed.hu",
  "CC0":"https://creativecommons.org/publicdomain/zero/1.0/deed.hu",
  "Public domain":"https://commons.wikimedia.org/wiki/Commons:Licensing"
};
const licUrl = l => LIC[l] || "https://commons.wikimedia.org/wiki/Commons:Licensing";
const imgUrl  = f => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f) + "?width=640";
const fileUrl = f => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(f.replace(/ /g,'_'));

const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

const plants = AJANLOTT.map(r => ({
  hu:r[0], lat:r[1], note:r[2], orig:r[3], toxic:!!r[4],
  feny:r[5], viz:r[6], meret:r[7],
  img:imgUrl(r[8]), file:fileUrl(r[8]), by:r[9], lic:r[10], licU:licUrl(r[10]),
  kat:r[11], id:slug(r[1])
}));
const invaziv = INVAZIV.map(r => ({
  hu:r[0], lat:r[1], why:r[2], szar:r[3]==="F"?"Fásszárú":"Lágyszárú", eu:!!r[4], toxic:!!r[5],
  img:imgUrl(r[6]), file:fileUrl(r[6]), by:r[7], lic:r[8], licU:licUrl(r[8]), rank:r[9], id:slug(r[1])
}));
const side = s => ({
  img:imgUrl(s.img), file:fileUrl(s.img), by:s.by, lic:s.lic, licU:licUrl(s.lic), cap:s.cap
});
const fenntart = FENNTART.map(r => ({
  hu:r[0], lat:r[1], toxic:!!r[2], meret:r[3], why:r[4], alt:r[5],
  img:imgUrl(r[6]), file:fileUrl(r[6]), by:r[7], lic:r[8], licU:licUrl(r[8]), id:slug(r[1]),
  compare: r[9] ? { left:side(r[9].left), right:side(r[9].right) } : null
}));
// A műfű nem növény és nem mediterrán jelenség, de a cikk külön kitér rá — a tévút lapon,
// vizuálisan elkülönítve jelenik meg.
const mufu = {
  hu:"Műfű (műgyep)", lat:"nem növény – műanyag gyepszőnyeg", toxic:false,
  meret:"Burkolat; jellemzően 20–40 mm szálhosszal",
  why:"A cikk külön kiemeli: a műfű nyáron akár 60 °C-ra is felmelegszik, vagyis a hőség ellen nemhogy nem véd, hanem hőszigetként sugározza vissza a meleget. Élő gyep helyett nincs párologtatás, tehát a kert hűtő hatása is elmarad. Alatta a talajélet elhal, beporzóknak és madaraknak semmit nem nyújt, a szálakról mikroműanyag kopik le, élettartama végén pedig nehezen újrahasznosítható hulladék. Az öntözést valóban megspórolja — minden mást elvesz.",
  alt:"Gyeppótlók a listáról: keskenylevelű kakukkfű, eperhere, ezüstös cickafark, juhcsenkesz; erősen árnyékos, taposott helyre inkább mulcs vagy szilárd burkolat",
  img:imgUrl("Astroturf at the Bahá'í gardens - Sarah Stierch.jpg"),
  file:fileUrl("Astroturf at the Bahá'í gardens - Sarah Stierch.jpg"),
  by:"Sarah Stierch", lic:"CC BY 4.0", licU:licUrl("CC BY 4.0"), id:"mufu"
};

const mediterran = MEDITERRAN.map(r => ({
  hu:r[0], lat:r[1], toxic:!!r[2], meret:r[3], why:r[4], alt:r[5],
  img:imgUrl(r[6]), file:fileUrl(r[6]), by:r[7], lic:r[8], licU:licUrl(r[8]), id:slug(r[1])
}));

const DATA = { plants, invaziv, fenntart, mediterran, mufu };

// ---- képforrás-jegyzék (külön md) ----
const allImgs = [
  ...plants.map(p=>({n:p.hu, l:p.lat, ...p})),
  ...fenntart.flatMap(p => p.compare
    ? [{n:p.hu+" (aszály után)", l:p.lat, ...p.compare.left},
       {n:p.hu+" (frissen nyírva)", l:p.lat, ...p.compare.right}]
    : [{n:p.hu, l:p.lat, ...p}]),
  ...mediterran.map(p=>({n:p.hu, l:p.lat, ...p})),
  {n:mufu.hu, l:mufu.lat, ...mufu},
  ...invaziv.map(p=>({n:p.hu, l:p.lat, ...p}))
];
const credits = `# Képek forrásjegyzéke

Az oldalon szereplő minden fotó a [Wikimedia Commons](https://commons.wikimedia.org/) szabad
felhasználású állományából származik. Az alábbi táblázat fajonként tartalmazza a szerzőt, a
licencet és az eredeti fájl elérhetőségét, ahogy azt a licencfeltételek megkövetelik.

A képeket változatlan formában, a Wikimedia által generált méretezett változatban jelenítjük meg.
A megjelenítés a Commons hivatalos Special:FilePath végpontján keresztül történik.

| Faj | Tudományos név | Szerző | Licenc | Eredeti fájl |
|---|---|---|---|---|
${allImgs.map(p=>`| ${p.n} | *${p.l}* | ${p.by} | [${p.lic}](${p.licU}) | [Commons](${p.file}) |`).join("\n")}

Összesen: **${allImgs.length}** kép.
`;

// ---------------- HTML ----------------
const html = `<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Klímaálló kert – szűrhető növénykalauz</title>
<meta name="description" content="Szűrhető növénykalauz Bardóczi Sándor főtájépítész TOP 100-as klímatűrő és TOP 20-as invazív növénylistája alapján. Szárazságtűrő kertépítés, víztakarékos kert.">
<link rel="canonical" href="${SITE_URL}">
<meta property="og:title" content="Klímaálló kert – szűrhető növénykalauz">
<meta property="og:description" content="100 klímatűrő faj szűrhetően, plusz amit már nem érdemes telepíteni. Bardóczi Sándor listája alapján.">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:locale" content="hu_HU">
<meta property="og:site_name" content="Klímaálló kert">
<meta property="og:image" content="${SITE_URL}og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Klímaálló kert – szűrhető növénykalauz, Bardóczi Sándor főtájépítész listája alapján">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>">
<style>
:root{
  --g900:#1b4332;--g700:#2d6a4f;--g500:#40916c;--g300:#95d5b2;--g100:#e9f7ef;
  --a700:#92400e;--a600:#b45309;--a100:#fef3c7;
  --r700:#b91c1c;--r100:#fee2e2;--b600:#2563eb;
  --ink:#1f2a24;--mut:#5b6b62;--paper:#fbfaf7;--card:#fff;--bd:#e3e8e2;
  --sh:0 1px 2px rgba(27,67,50,.06),0 6px 20px rgba(27,67,50,.07);--rad:14px;
}
*{box-sizing:border-box}
body{margin:0;font-family:"Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;background:var(--paper);color:var(--ink);line-height:1.5}
a{color:var(--g700)}
header.top{background:linear-gradient(135deg,var(--g900),var(--g700));color:#fff;padding:26px 20px 22px}
header.top .wrap{max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;gap:24px;flex-wrap:wrap}
header.top h1{margin:0 0 6px;font-size:1.55rem}
header.top p.sub{margin:0;color:#dff2e6;max-width:66ch;font-size:.93rem}
.byline{font-size:.78rem;color:#b7dcc6;text-align:right;white-space:nowrap;padding-top:4px}
.byline strong{color:#e8f6ee;font-weight:600}
nav.tabs{max-width:1180px;margin:0 auto;display:flex;gap:2px;padding:14px 20px 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}
nav.tabs button{background:none;border:none;cursor:pointer;font-size:.92rem;font-weight:600;padding:10px 13px;color:var(--mut);border-bottom:3px solid transparent}
nav.tabs button:hover{color:var(--g700)}
nav.tabs button.active{color:var(--g900);border-bottom-color:var(--g700)}
nav.tabs button .n{font-size:.71rem;background:var(--g100);color:var(--g700);padding:1px 7px;border-radius:20px;margin-left:5px;font-weight:700}
nav.tabs button.warn.active{border-bottom-color:var(--a600);color:var(--a700)}
nav.tabs button.warn .n{background:var(--a100);color:var(--a700)}
nav.tabs button.danger.active{border-bottom-color:var(--r700);color:var(--r700)}
nav.tabs button.danger .n{background:var(--r100);color:var(--r700)}
main{max-width:1180px;margin:0 auto;padding:20px}
section.tabpanel{display:none}
section.tabpanel.active{display:block}
.lead{background:var(--card);border:1px solid var(--bd);border-left:4px solid var(--g700);border-radius:var(--rad);padding:14px 18px;margin-bottom:16px;box-shadow:var(--sh);font-size:.9rem;color:var(--mut)}
.lead.warn{border-left-color:var(--a600)}
.lead.danger{border-left-color:var(--r700)}
.lead.info{border-left-color:var(--b600)}
.lead strong{color:var(--ink)}
.lead p{margin:0 0 8px}
.lead p:last-child{margin-bottom:0}
.toolbar{display:flex;flex-wrap:wrap;gap:9px;align-items:center;background:var(--card);border:1px solid var(--bd);border-radius:var(--rad);padding:13px;margin-bottom:12px;box-shadow:var(--sh)}
.toolbar input[type=search]{flex:1 1 190px;padding:9px 12px;border:1px solid var(--bd);border-radius:8px;font-size:.9rem}
.toolbar select{padding:8px 10px;border:1px solid var(--bd);border-radius:8px;font-size:.85rem;background:#fff;color:var(--ink);max-width:180px}
.btn-reset{padding:8px 12px;border:1px solid var(--bd);border-radius:8px;background:#fff;font-size:.83rem;cursor:pointer;color:var(--mut)}
.btn-reset:hover{background:var(--g100);color:var(--g700)}
.count-line{font-size:.84rem;color:var(--mut);margin:0 2px 13px}
.empty{padding:30px;text-align:center;color:var(--mut);font-size:.9rem;background:var(--card);border:1px dashed var(--bd);border-radius:var(--rad)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:15px}
.card{background:var(--card);border:1px solid var(--bd);border-radius:var(--rad);overflow:hidden;box-shadow:var(--sh);display:flex;flex-direction:column}
.imgwrap{position:relative;aspect-ratio:4/3;background:var(--g100);overflow:hidden}
.imgwrap img{width:100%;height:100%;object-fit:cover;display:block}
.imgwrap.noimg::after{content:"kép nem tölthető be";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:.8rem}
.credit{position:absolute;bottom:0;right:0;left:0;background:rgba(15,30,20,.62);color:#fff;font-size:.65rem;padding:3px 7px;text-align:right;line-height:1.35}
.credit a{color:#fff;text-decoration:underline}
.badges{position:absolute;top:8px;left:8px;display:flex;gap:5px;flex-wrap:wrap;max-width:calc(100% - 16px)}
.badge{font-size:.67rem;font-weight:700;padding:3px 9px;border-radius:20px;border:none;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.badge:hover{filter:brightness(1.12)}
.badge.native{background:var(--g500);color:#fff}
.badge.nonnative{background:var(--b600);color:#fff}
.badge.toxic{background:#111827;color:#fbbf24}
.badge.woody{background:#7c3f1d;color:#fff}
.badge.herb{background:#4d7c0f;color:#fff}
.badge.static{cursor:default;box-shadow:none}
.card .body{padding:13px 14px 15px;display:flex;flex-direction:column;gap:8px;flex:1}
.card h3{margin:0;font-size:1rem;line-height:1.25}
.card h3 .latin{display:block;font-style:italic;font-weight:400;color:var(--mut);font-size:.82rem;margin-top:3px}
.tags{display:flex;flex-wrap:wrap;gap:5px}
.tag{font-size:.71rem;background:var(--g100);color:var(--g900);padding:2px 8px;border-radius:20px;border:1px solid var(--g300)}
.kerulendo .tag{background:#f3f4f6;color:#374151;border-color:#d1d5db}
.card.wide{grid-column:span 2}
@media (max-width:600px){.card.wide{grid-column:span 1}}
.cmp{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--g100);user-select:none;touch-action:pan-y}
.cmp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.cmp-clip{position:absolute;inset:0;clip-path:inset(0 50% 0 0)}
.cmp-bar{position:absolute;top:0;bottom:0;left:50%;width:3px;background:#fff;box-shadow:0 0 6px rgba(0,0,0,.45);transform:translateX(-50%);pointer-events:none}
.cmp-knob{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:34px;height:34px;border-radius:50%;background:#fff;color:var(--g900);display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 2px 8px rgba(0,0,0,.35)}
.cmp-range{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.cmp-range:focus-visible + .credit{outline:2px solid var(--g700)}
.cmp-lbl{position:absolute;top:8px;font-size:.68rem;font-weight:700;color:#fff;background:rgba(15,30,20,.6);padding:3px 9px;border-radius:20px;pointer-events:none}
.cmp-l{left:8px}
.cmp-r{right:8px}
.cmp-credit{pointer-events:auto}
.note{margin-top:auto;font-size:.85rem;color:var(--ink);background:#f7faf8;border:1px solid var(--bd);border-radius:8px;padding:8px 10px}
.src{display:block;margin-top:4px;font-size:.72rem;color:var(--mut);font-style:italic}
.srcw{display:block;margin-top:5px;font-size:.72rem;opacity:.75;font-style:italic}
.why{font-size:.83rem;background:var(--r100);border:1px solid #f3b4b4;border-radius:8px;padding:9px 11px;color:#7f1d1d}
.why.decl{background:var(--a100);border-color:#f3d38a;color:#7c4a03}
.alt{font-size:.79rem;background:var(--g100);border:1px solid var(--g300);border-radius:8px;padding:8px 11px;color:var(--g900)}
.alt strong{color:var(--g700)}
.facts{margin:0;font-size:.81rem;display:grid;grid-template-columns:auto 1fr;gap:3px 9px}
.facts dt{color:var(--mut);font-weight:600;white-space:nowrap}
.facts dd{margin:0}
.quote{margin-top:auto;padding-top:9px;border-top:1px dashed var(--bd);font-size:.75rem;color:var(--mut);font-style:italic}
.box{background:var(--card);border:1px solid var(--bd);border-radius:var(--rad);padding:18px 20px;box-shadow:var(--sh);margin-bottom:18px}
.box h3{margin-top:0;color:var(--g900);font-size:1.05rem}
.box p{font-size:.9rem}
.cmt{background:#f7faf8;border:1px solid var(--bd);border-radius:10px;padding:14px 16px;font-size:.85rem;margin-top:10px}
.cmt h4{margin:14px 0 6px;font-size:.89rem;color:var(--g900)}
.cmt h4:first-child{margin-top:0}
.cmt ol{margin:0;padding-left:22px}
.cmt li{margin-bottom:3px}
.cmt li i{color:var(--mut)}
table.t{width:100%;border-collapse:collapse;font-size:.84rem;margin-top:8px}
table.t th,table.t td{text-align:left;padding:7px 9px;border-bottom:1px solid var(--bd);vertical-align:top}
table.t th{color:var(--mut);font-weight:600;background:#f7faf8}
.flag{display:inline-block;font-size:.67rem;font-weight:700;padding:1px 7px;border-radius:20px;white-space:nowrap}
.flag.a{background:var(--g100);color:var(--g700);border:1px solid var(--g300)}
.flag.b{background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd}
.flag.c{background:var(--a100);color:var(--a700);border:1px solid #f3d38a}
.mufu-block{margin-top:34px;padding-top:26px;border-top:2px dashed var(--bd)}
.mufu-block h2{font-size:1.12rem;color:var(--a700);margin:0 0 6px}
.mufu-block > p{font-size:.88rem;color:var(--mut);max-width:75ch;margin:0 0 14px}
.mufu-block .grid{grid-template-columns:repeat(auto-fill,minmax(255px,1fr))}
.disclaim{margin-top:30px;padding:13px 16px;border:1px solid var(--bd);border-radius:10px;background:#f7f8f7;color:var(--mut);font-size:.79rem;line-height:1.55}
.disclaim strong{color:#4a5a51}
.fbhold{border:1px solid var(--bd);border-radius:10px;background:#f7faf8;padding:22px;text-align:center;max-width:520px}
.fbhold p{font-size:.85rem;color:var(--mut);margin:0 0 12px}
.fbhold button{background:var(--g700);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:.88rem;font-weight:600;cursor:pointer;font-family:inherit}
.fbhold button:hover{background:var(--g900)}
footer{max-width:1180px;margin:20px auto 40px;padding:0 20px;color:var(--mut);font-size:.78rem}
footer a{color:var(--g700)}
@media (max-width:640px){header.top .wrap{flex-direction:column;gap:10px}.byline{text-align:left}}
</style>
</head>
<body>

<header class="top">
  <div class="wrap">
    <div>
      <h1>Klímaálló kert – szűrhető növénykalauz</h1>
      <p class="sub">Bardóczi Sándor főtájépítész posztjában szereplő TOP 100-as klímatűrő és TOP 20-as invazív növénylista alapján, kereshető és szűrhető formában.</p>
    </div>
    <div class="byline">Készítette:<br><strong>Udvari István</strong> · Adatelemző</div>
  </div>
</header>

<nav class="tabs">
  <button class="tab-btn active" data-tab="ajanlott">Ajánlott növények <span class="n">${plants.length}</span></button>
  <button class="tab-btn warn" data-tab="fenntart">Már nem fenntartható <span class="n">${fenntart.length}</span></button>
  <button class="tab-btn warn" data-tab="mediterran">A mediterrán tévút <span class="n">${mediterran.length}</span></button>
  <button class="tab-btn danger" data-tab="invaziv">Invazív – ne telepítsd <span class="n">${invaziv.length}</span></button>
  <button class="tab-btn" data-tab="forras">Forrás és módszertan</button>
</nav>

<main>

<section class="tabpanel active" id="tab-ajanlott">
  <div class="lead info">
    <p><strong>Miről van szó?</strong> Bardóczi Sándor főtájépítész szerint a thuja, a lucfenyő, a nyírfa és a vízpazarló „angolpázsit" korszakának vége: a vízkorlátozások idején ezek a kertek már nem tarthatók fenn. Válaszul összeállított egy 100 fajos listát, amely a hazai kertészeti kínálatot, a szárazságtűrést és azt is figyelembe veszi, hogy ne szabadítsunk el újabb inváziós fajokat az országra.</p>
    <p style="font-size:.86rem">Eredeti forrás: <a href="https://www.facebook.com/sandor.bardoczi/posts/pfbid0b2bJpSzT8kK5njYtyAW9bakt8uAJc28JJPKr9zxds5vatrVStaGUc4VUNmwr13Rbl" target="_blank" rel="noopener">Bardóczi Sándor Facebook-bejegyzése</a> · feldolgozva: <a href="https://sokszinuvidek.24.hu/kertunk-portank/2026/08/17/kert-noveny-klimavaltozas-aszaly-hoseg/" target="_blank" rel="noopener">Sokszínű vidék / 24.hu</a></p>
  </div>
  <div class="lead">
    <strong>Fontos:</strong> a szárazságtűrés a <strong>már begyökeresedett</strong> növényre vonatkozik. Beültetés után minden növény igényli az extra öntözést — fák és cserjék több évig, évelők legalább az első évben. Egyik faj sincs meg hónapokig víz nélkül, csak kevesebb vízzel is túlél.
  </div>
  <div class="toolbar">
    <input type="search" id="q" placeholder="Keresés magyar vagy latin névre…">
    <select id="f-kat"><option value="">Kategória (mind)</option></select>
    <select id="f-mer"><option value="">Méret (mind)</option></select>
    <select id="f-fen"><option value="">Fényigény (mind)</option></select>
    <select id="f-viz"><option value="">Vízigény (mind)</option></select>
    <select id="f-ere"><option value="">Eredet (mind)</option><option value="O">Őshonos</option><option value="I">Nem inváziós</option></select>
    <select id="f-tox"><option value="">Mérgezőség (mind)</option><option value="no">Csak nem mérgező</option><option value="yes">Csak mérgező</option></select>
    <button class="btn-reset" id="r1">Szűrők törlése</button>
  </div>
  <div class="count-line" id="c1"></div>
  <div class="grid" id="g1"></div>
  <div class="empty" id="e1" style="display:none">Nincs a szűrőknek megfelelő növény.</div>
</section>

<section class="tabpanel" id="tab-fenntart">
  <div class="lead warn">
    <p><strong>Régen népszerű, ma már nem fenntartható.</strong> Ezek nem inváziós fajok — a gond az, hogy nagy és folyamatos a vízigényük, illetve hűvösebb, párásabb klímához alkalmazkodtak. A mai aszályos nyarakon tömegesen pusztulnak.</p>
    <p>Nem kell azonnal kivágni őket: a javaslat a <strong>fokozatos csere</strong> — ahogy egy-egy példány kidől, a helyére már szárazságtűrő faj kerüljön.</p>
    <p style="font-size:.83rem"><em>A fajokat a cikk szerzője nevezi meg kerülendőként; az alábbi részletes indoklások és a „Helyette" javaslatok az oldal készítőjének összefoglalásai.</em></p>
  </div>
  <div class="toolbar"><input type="search" id="q2" placeholder="Keresés név szerint…"><button class="btn-reset" id="r2">Szűrők törlése</button></div>
  <div class="count-line" id="c2"></div>
  <div class="grid" id="g2"></div>
  <div class="empty" id="e2" style="display:none">Nincs találat.</div>
</section>

<section class="tabpanel" id="tab-mediterran">
  <div class="lead warn">
    <p><strong>„Akkor csináljunk mediterrán kertet!" — és itt a leggyakoribb tévedés.</strong> Sokan azt gondolják, hogy ha melegszik az éghajlat, akkor irány az olajfa, a leander, a babér és a narancsfa. A cikk szerzője kifejezetten óva int ettől.</p>
    <p>Az ok: a Kárpát-medence klímája nem mediterrán, hanem <strong>szélsőséges</strong>. Egyszerre kell felkészülni extrém szárazságra, egyszerre lezúduló nagy esőre, 40 fokra <em>és</em> mínusz 15-re. A mediterrán fajok a nyarat kibírnák — a telet nem. A műfű pedig, amit gyakran társítanak hozzá, nyáron akár 60 °C-ra is felmelegszik.</p>
    <p style="font-size:.83rem"><em>A fajokat a cikk szerzője említi; az alábbi részletes indoklások, fagytűrési adatok és a „Helyette" javaslatok az oldal készítőjének összefoglalásai.</em></p>
  </div>
  <div class="count-line" id="c4"></div>
  <div class="grid" id="g4"></div>

  <div class="mufu-block">
    <h2>És ha már a mediterrán kertnél tartunk: a műfű</h2>
    <p>A műfű <strong>nem mediterrán jelenség</strong>, és nem is növény — mégis ide kívánkozik, mert
    tipikusan ugyanabban a csomagban szokták ajánlani, és a cikk szerzője is együtt említi velük.
    Kertbarátként viszont épp annyira kerülendő.</p>
    <div class="grid" id="g5"></div>
  </div>
</section>

<section class="tabpanel" id="tab-invaziv">
  <div class="lead danger">
    <p><strong>Új telepítésként nem ajánlott.</strong> Inváziós fajok: könnyen kiszabadulnak a kertből, és a hazai élőhelyeket, a biológiai sokféleséget károsítják. A szerző megfogalmazásában ezekkel „a kertünkből ütjük agyon a biológiai sokféleséget".</p>
    <p>Amelyik <strong>uniós jegyzékes</strong>, annak a telepítése és forgalmazása jogszabályba is ütközik.</p>
  </div>
  <div class="toolbar">
    <input type="search" id="q3" placeholder="Keresés név szerint…">
    <select id="f-szar"><option value="">Szár típusa (mind)</option><option value="Fásszárú">Fásszárú</option><option value="Lágyszárú">Lágyszárú</option></select>
    <select id="f-eu"><option value="">Uniós jegyzék (mind)</option><option value="yes">Csak uniós jegyzékes</option></select>
    <button class="btn-reset" id="r3">Szűrők törlése</button>
  </div>
  <div class="count-line" id="c3"></div>
  <div class="grid" id="g3"></div>
  <div class="empty" id="e3" style="display:none">Nincs találat.</div>
</section>

<section class="tabpanel" id="tab-forras">

  <div class="box">
    <h3>A forrás</h3>
    <p>Az oldalon szereplő növénylista <strong>Bardóczi Sándor</strong> főtájépítész, tájépítészeti osztályvezető munkája: a TOP 100-as klímatűrő, víztakarékos lista és a TOP 20-as invazív, kerülendő lista egyaránt tőle származik.</p>
    <p>Elsődleges forrás: <a href="https://www.facebook.com/sandor.bardoczi/posts/pfbid0b2bJpSzT8kK5njYtyAW9bakt8uAJc28JJPKr9zxds5vatrVStaGUc4VUNmwr13Rbl" target="_blank" rel="noopener">a szerző Facebook-bejegyzése</a> és az ahhoz fűzött saját kommentje.<br>
    Újságcikk-feldolgozás: <a href="https://sokszinuvidek.24.hu/kertunk-portank/2026/08/17/kert-noveny-klimavaltozas-aszaly-hoseg/" target="_blank" rel="noopener">„Elérkezett a szárazságtűrő kertépítés kora: itt a top 100-as lista"</a> — Sokszínű vidék / 24.hu, 2026. 08. 17.</p>
    <p style="margin-bottom:0">Ez az oldal <strong>nem hivatalos, nem a szerző és nem a 24.hu kiadványa</strong> — rajongói feldolgozás, amelynek egyetlen célja, hogy a lista könnyebben kereshető és szűrhető legyen. A növénynevek és a rövid, dőlt betűs jellemzések a szerző listájából származnak.</p>
  </div>

  <div class="box">
    <h3>Az eredeti Facebook-bejegyzés</h3>
    <p>A bejegyzés beágyazása a Facebook szervereivel kommunikál és sütiket használhat, ezért csak kattintásra töltjük be:</p>
    <div id="fbslot">
      <div class="fbhold">
        <p>A tartalom betöltésével adatok kerülhetnek a Facebook (Meta) felé, az ő adatkezelési feltételeik szerint.</p>
        <button id="fbload">Facebook-bejegyzés betöltése</button>
      </div>
    </div>
    <p style="margin-top:10px;margin-bottom:0;font-size:.85rem">Betöltés nélkül is elérhető: <a href="https://www.facebook.com/sandor.bardoczi/posts/pfbid0b2bJpSzT8kK5njYtyAW9bakt8uAJc28JJPKr9zxds5vatrVStaGUc4VUNmwr13Rbl" target="_blank" rel="noopener">megnyitás a Facebookon →</a></p>
  </div>

  <div class="box">
    <h3>A TOP 20 invazív lista – a szerző kommentje</h3>
    <p style="font-size:.83rem;color:var(--mut)">Bardóczi Sándor hozzászólása a saját bejegyzéséhez — az „Invazív" fül teljes forrása:</p>
    <div class="cmt">
      <p style="margin-top:0"><em>„TOP20 invazív lista, amivel a kertünkből ütjük agyon a biológiai sokféleséget"</em></p>
      <h4>Kerülendő fás szárúak</h4>
      <ol>${invaziv.filter(i=>i.szar==="Fásszárú").map(i=>`<li><i>${i.lat}</i> – ${i.hu.toLowerCase()}: ${i.why.charAt(0).toLowerCase()+i.why.slice(1)}</li>`).join("")}</ol>
      <h4>Kerülendő lágyszárúak</h4>
      <ol start="11">${invaziv.filter(i=>i.szar==="Lágyszárú").map(i=>`<li><i>${i.lat}</i> – ${i.hu.toLowerCase()}: ${i.why.charAt(0).toLowerCase()+i.why.slice(1)}</li>`).join("")}</ol>
    </div>
  </div>

  <div class="box">
    <h3>Honnan származnak az adatok?</h3>
    <p>A kártyákon szereplő információk három, eltérő megbízhatóságú forrásból állnak össze. Ezt fontosnak tartjuk jelölni, mert nem egyforma a súlyuk:</p>
    <table class="t">
      <tr><th>Jelölés</th><th>Mit takar</th><th>Megbízhatóság</th></tr>
      <tr><td><span class="flag a">szerző</span></td><td>A dőlt betűs jellemzés, az Ő/I besorolás (őshonos / idegenhonos de nem inváziós), a kategóriák, valamint az invazív fajok indoklása.</td><td>Közvetlenül a szakértő szerzőtől — ez a legerősebb.</td></tr>
      <tr><td><span class="flag b">lexikon</span></td><td>A méretadatok, a lombhullató/örökzöld jelleg, a fagytűrési határok és a mérgező hatóanyagok.</td><td>Wikipédia és botanikai szakirodalom alapján.</td></tr>
      <tr><td><span class="flag c">besorolás</span></td><td>A fényigény-, vízigény- és méretkategória, amely alapján szűrni lehet.</td><td>A szerző megjegyzéséből és általános kertészeti ismeretből származtatva — <strong>tájékoztató jellegű</strong>, nem egyetlen hivatkozható adatbázisból.</td></tr>
    </table>
    <p style="margin-bottom:0"><strong>Következő lépés:</strong> a „besorolás" mezőket egy valódi, strukturált kertészeti adatbázisból töltjük fel, hogy minden érték mögött konkrét hivatkozás álljon. Erre a <a href="https://www.missouribotanicalgarden.org/plantfinder/plantfindersearch.aspx" target="_blank" rel="noopener">Missouri Botanical Garden Plant Finder</a> és az <a href="https://www.rhs.org.uk/plants/search-form" target="_blank" rel="noopener">RHS Plant Finder</a> szolgál alapul. Ekkor kerülnek be a részletes adatlapok is: talajigény, növekedési erély, virágzási idő, beporzóbarát jelleg.</p>
  </div>

  <div class="box">
    <h3>Növényképek</h3>
    <p>Minden fotó a <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a> szabad felhasználású állományából származik, változatlan formában. A kártyákon a szerző neve és a licenc típusa is szerepel, a licencnévre kattintva megnyílnak a feltételek, a fotós nevére kattintva pedig az eredeti fájl.</p>
    <p style="margin-bottom:0">A teljes, fajonkénti forrásjegyzék külön fájlban is elérhető a projekt tárhelyén: <code>KEPEK-FORRASOK.md</code></p>
  </div>

  <div class="box">
    <h3>Adatvédelem</h3>
    <p style="margin-bottom:0">Ez az oldal <strong>nem gyűjt személyes adatot</strong>: nincs rajta űrlap, regisztráció, süti, analitika vagy nyomkövetés. Az egyetlen külső tartalom a növényképek (Wikimedia Commons), valamint a fentebbi, <strong>külön kattintásra</strong> betölthető Facebook-bejegyzés — utóbbi előtt semmilyen adat nem kerül a Meta felé.</p>
  </div>

</section>
</main>

<footer>
  Rajongói feldolgozás Bardóczi Sándor főtájépítész nyilvános növénylistája alapján — nem hivatalos kiadvány.
  Képek: Wikimedia Commons közreműködői, a kártyákon jelölt licencek szerint.
  A besorolások tájékoztató jellegűek; ültetés előtt érdemes szakértővel egyeztetni.
</footer>

<script>
const DATA = ${JSON.stringify(DATA)};
const ORD = {
  kat:["Örökzöld","Lombhullató fa","Cserje","Napos évelő","Árnyéki talajtakaró","Kúszónövény","Gyeppótló"],
  mer:["XS · 50 cm alatt","S · 0,5–1,5 m","M · 1,5–4 m","L · 4–10 m","XL · 10 m felett"],
  fen:["Tűző nap","Napos","Napos–félárnyék","Félárnyék","Félárnyék–árnyék","Árnyék"],
  viz:["Nagyon alacsony","Alacsony","Alacsony–közepes","Közepes"]
};
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const ERR = "this.closest('.imgwrap').classList.add('noimg');this.style.display='none';";

function credit(p){
  return '<div class="credit">Kép: <a href="'+esc(p.file)+'" target="_blank" rel="noopener">'+esc(p.by)+'</a> · <a href="'+esc(p.licU)+'" target="_blank" rel="noopener">'+esc(p.lic)+'</a></div>';
}
function pic(p){
  return '<img src="'+esc(p.img)+'" alt="'+esc(p.hu)+' ('+esc(p.lat)+')" loading="lazy" onerror="'+ERR+'">';
}

function cardPlant(p){
  const ob = p.orig==="O"
    ? '<button class="badge native" data-f="ere" data-v="O" title="Szűrés az őshonos fajokra">Őshonos</button>'
    : '<button class="badge nonnative" data-f="ere" data-v="I" title="Szűrés az idegenhonos, nem inváziós fajokra">Nem inváziós</button>';
  const tb = p.toxic ? '<button class="badge toxic" data-f="tox" data-v="yes" title="Szűrés a mérgező fajokra">mérgező</button>' : '';
  return '<div class="card" data-kat="'+esc(p.kat)+'" data-mer="'+esc(p.meret)+'" data-fen="'+esc(p.feny)+'" data-viz="'+esc(p.viz)+'" data-ere="'+p.orig+'" data-tox="'+p.toxic+'" data-n="'+esc((p.hu+" "+p.lat).toLowerCase())+'">'
    + '<div class="imgwrap">'+pic(p)+'<div class="badges">'+ob+tb+'</div>'+credit(p)+'</div>'
    + '<div class="body"><h3>'+esc(p.hu)+'<span class="latin">'+esc(p.lat)+'</span></h3>'
    + '<div class="tags"><span class="tag">'+esc(p.kat)+'</span><span class="tag">📏 '+esc(p.meret)+'</span><span class="tag">☀ '+esc(p.feny)+'</span><span class="tag">💧 '+esc(p.viz)+'</span></div>'
    + '<div class="note">„'+esc(p.note)+'” <span class="src">— Bardóczi Sándor listája</span></div></div></div>';
}

function compareBox(c){
  return '<div class="cmp" data-cmp>'
    + '<img class="cmp-b" src="'+esc(c.right.img)+'" alt="'+esc(c.right.cap)+'" loading="lazy" onerror="'+ERR+'">'
    + '<div class="cmp-clip"><img src="'+esc(c.left.img)+'" alt="'+esc(c.left.cap)+'" loading="lazy"></div>'
    + '<div class="cmp-lbl cmp-l">'+esc(c.left.cap)+'</div>'
    + '<div class="cmp-lbl cmp-r">'+esc(c.right.cap)+'</div>'
    + '<div class="cmp-bar"><span class="cmp-knob">⇄</span></div>'
    + '<input type="range" class="cmp-range" min="0" max="100" value="50" aria-label="Kép-összehasonlító csúszka">'
    + '<div class="credit cmp-credit">Bal: <a href="'+esc(c.left.file)+'" target="_blank" rel="noopener">'+esc(c.left.by)+'</a> · '
    + 'Jobb: <a href="'+esc(c.right.file)+'" target="_blank" rel="noopener">'+esc(c.right.by)+'</a> · '
    + '<a href="'+esc(c.right.licU)+'" target="_blank" rel="noopener">'+esc(c.right.lic)+'</a>, Wikimedia Commons</div>'
    + '</div>';
}

function cardWarn(p, cls){
  const tb = p.toxic ? '<span class="badge toxic static">mérgező</span>' : '';
  const media = p.compare
    ? compareBox(p.compare)
    : '<div class="imgwrap">'+pic(p)+'<div class="badges">'+tb+'</div>'+credit(p)+'</div>';
  return '<div class="card kerulendo'+(p.compare?' wide':'')+'" data-n="'+esc((p.hu+" "+p.lat).toLowerCase())+'">'
    + media
    + '<div class="body"><h3>'+esc(p.hu)+'<span class="latin">'+esc(p.lat)+'</span></h3>'
    + '<dl class="facts"><dt>Méret</dt><dd>'+esc(p.meret)+'</dd></dl>'
    + '<div class="why '+cls+'">'+esc(p.why)+'</div>'
    + '<div class="alt"><strong>Helyette:</strong> '+esc(p.alt)+'</div></div></div>';
}

function cardInv(p){
  const sb = p.szar==="Fásszárú"
    ? '<button class="badge woody" data-f="szar" data-v="Fásszárú" title="Szűrés a fásszárúakra">Fásszárú</button>'
    : '<button class="badge herb" data-f="szar" data-v="Lágyszárú" title="Szűrés a lágyszárúakra">Lágyszárú</button>';
  const tb = p.toxic ? '<span class="badge toxic static">mérgező</span>' : '';
  return '<div class="card kerulendo" data-szar="'+esc(p.szar)+'" data-eu="'+p.eu+'" data-n="'+esc((p.hu+" "+p.lat).toLowerCase())+'">'
    + '<div class="imgwrap">'+pic(p)+'<div class="badges">'+sb+tb+'</div>'+credit(p)+'</div>'
    + '<div class="body"><h3>'+esc(p.hu)+'<span class="latin">'+esc(p.lat)+'</span></h3>'
    + '<div class="tags"><span class="tag">TOP20 · #'+p.rank+'</span>'+(p.eu?'<span class="tag">⚠ uniós jegyzékes</span>':'')+'</div>'
    + '<div class="why">„'+esc(p.why)+'” <span class="srcw">— a szerző TOP20-as listája</span></div></div></div>';
}

document.getElementById("g1").innerHTML = DATA.plants.map(cardPlant).join("");
document.getElementById("g2").innerHTML = DATA.fenntart.map(p=>cardWarn(p,"decl")).join("");
document.getElementById("g4").innerHTML = DATA.mediterran.map(p=>cardWarn(p,"decl")).join("");
document.getElementById("g5").innerHTML = cardWarn(DATA.mufu,"decl");
document.getElementById("g3").innerHTML = DATA.invaziv.map(cardInv).join("");
document.getElementById("c4").textContent = DATA.mediterran.length + " faj";

/* felelősségkizárás + AI-jelölés minden lap alján */
const DISCLAIM = '<div class="disclaim"><strong>Felelősségkizárás:</strong> ez az oldal tájékoztató jellegű, '
  + 'nem hivatalos kiadvány, és nem helyettesíti a szakértői kerttervezést. A méret-, fény- és vízigény-besorolás, '
  + 'valamint a növénynevek melletti kiegészítő adatok tartalmazhatnak pontatlanságot; ültetés előtt érdemes '
  + 'szakemberrel egyeztetni, mérgező vagy tövises fajoknál pedig külön mérlegelni, ha kisgyerek vagy háziállat is '
  + 'használja a kertet. A növénylista <strong>Bardóczi Sándor</strong> főtájépítész munkája, az oldal készítője '
  + 'kizárólag a kereshető, szűrhető formába rendezésért felel. '
  + '<strong>A feldolgozás mesterséges intelligencia (Claude, Anthropic) használatával készült</strong>, '
  + 'ezért a szerkesztői döntések és az adatbesorolások gépi közreműködést is tartalmaznak.</div>';
document.querySelectorAll("section.tabpanel").forEach(s=>s.insertAdjacentHTML("beforeend", DISCLAIM));

function fill(id, key, ord){
  const sel = document.getElementById(id);
  const present = new Set(DATA.plants.map(p=>p[key]));
  ord.filter(v=>present.has(v)).forEach(v=>{ const o=document.createElement("option"); o.value=v; o.textContent=v; sel.appendChild(o); });
}
fill("f-kat","kat",ORD.kat); fill("f-mer","meret",ORD.mer); fill("f-fen","feny",ORD.fen); fill("f-viz","viz",ORD.viz);

document.querySelectorAll(".tab-btn").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".tab-btn").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".tabpanel").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  document.getElementById("tab-"+b.dataset.tab).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}));

function f1(){
  const q=document.getElementById("q").value.trim().toLowerCase();
  const kat=document.getElementById("f-kat").value, mer=document.getElementById("f-mer").value;
  const fen=document.getElementById("f-fen").value, viz=document.getElementById("f-viz").value;
  const ere=document.getElementById("f-ere").value, tox=document.getElementById("f-tox").value;
  let n=0;
  document.querySelectorAll("#g1 .card").forEach(c=>{
    let ok=true; const d=c.dataset;
    if(q && !d.n.includes(q)) ok=false;
    if(kat && d.kat!==kat) ok=false;
    if(mer && d.mer!==mer) ok=false;
    if(fen && d.fen!==fen) ok=false;
    if(viz && d.viz!==viz) ok=false;
    if(ere && d.ere!==ere) ok=false;
    if(tox==="yes" && d.tox!=="true") ok=false;
    if(tox==="no" && d.tox==="true") ok=false;
    c.style.display=ok?"":"none"; if(ok)n++;
  });
  document.getElementById("c1").textContent = n+" / "+DATA.plants.length+" növény";
  document.getElementById("e1").style.display = n?"none":"";
}
["q","f-kat","f-mer","f-fen","f-viz","f-ere","f-tox"].forEach(id=>document.getElementById(id).addEventListener("input",f1));
document.getElementById("r1").addEventListener("click",()=>{
  ["f-kat","f-mer","f-fen","f-viz","f-ere","f-tox"].forEach(i=>document.getElementById(i).value="");
  document.getElementById("q").value=""; f1();
});

function f2(){
  const q=document.getElementById("q2").value.trim().toLowerCase(); let n=0;
  document.querySelectorAll("#g2 .card").forEach(c=>{ const ok=!q||c.dataset.n.includes(q); c.style.display=ok?"":"none"; if(ok)n++; });
  document.getElementById("c2").textContent = n+" / "+DATA.fenntart.length+" növény";
  document.getElementById("e2").style.display = n?"none":"";
}
document.getElementById("q2").addEventListener("input",f2);
document.getElementById("r2").addEventListener("click",()=>{document.getElementById("q2").value="";f2();});

function f3(){
  const q=document.getElementById("q3").value.trim().toLowerCase();
  const s=document.getElementById("f-szar").value, eu=document.getElementById("f-eu").value; let n=0;
  document.querySelectorAll("#g3 .card").forEach(c=>{
    let ok=true; const d=c.dataset;
    if(q && !d.n.includes(q)) ok=false;
    if(s && d.szar!==s) ok=false;
    if(eu==="yes" && d.eu!=="true") ok=false;
    c.style.display=ok?"":"none"; if(ok)n++;
  });
  document.getElementById("c3").textContent = n+" / "+DATA.invaziv.length+" növény";
  document.getElementById("e3").style.display = n?"none":"";
}
["q3","f-szar","f-eu"].forEach(id=>document.getElementById(id).addEventListener("input",f3));
document.getElementById("r3").addEventListener("click",()=>{
  document.getElementById("q3").value=""; document.getElementById("f-szar").value=""; document.getElementById("f-eu").value=""; f3();
});

document.addEventListener("click",e=>{
  const b=e.target.closest(".badge[data-f]"); if(!b) return;
  const f=b.dataset.f, v=b.dataset.v;
  if(f==="ere"){document.getElementById("f-ere").value=v; f1();}
  if(f==="tox"){document.getElementById("f-tox").value=v; f1();}
  if(f==="szar"){document.getElementById("f-szar").value=v; f3();}
});

/* kép-összehasonlító csúszkák */
document.querySelectorAll("[data-cmp]").forEach(box=>{
  const range = box.querySelector(".cmp-range");
  const clip  = box.querySelector(".cmp-clip");
  const bar   = box.querySelector(".cmp-bar");
  const set = v => {
    clip.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)";
    bar.style.left = v + "%";
  };
  range.addEventListener("input", () => set(+range.value));
  set(+range.value);
});

document.getElementById("fbload").addEventListener("click",()=>{
  document.getElementById("fbslot").innerHTML =
    '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsandor.bardoczi%2Fposts%2Fpfbid0b2bJpSzT8kK5njYtyAW9bakt8uAJc28JJPKr9zxds5vatrVStaGUc4VUNmwr13Rbl&show_text=true&width=500" width="500" height="582" style="border:none;overflow:hidden;max-width:100%" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
});

f1(); f2(); f3();
</script>
</body>
</html>`;

const outDir = process.argv[2] || '/home/claude/out';
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
fs.writeFileSync(path.join(outDir, 'KEPEK-FORRASOK.md'), credits);
console.log('OK plants=%d inv=%d fenn=%d med=%d imgs=%d bytes=%d',
  plants.length, invaziv.length, fenntart.length, mediterran.length, allImgs.length, html.length);
