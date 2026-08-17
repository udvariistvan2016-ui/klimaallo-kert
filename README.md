# Klímaálló kert – szűrhető növénykalauz

Interaktív, kereshető és szűrhető feldolgozása **Bardóczi Sándor** főtájépítész
klímatűrő növénylistájának.

**Élő oldal:** https://udvariistvan2016-ui.github.io/klimaallo-kert/

---

## Mi ez?

2026 nyarán Bardóczi Sándor főtájépítész közzétett egy 100 fajos listát azokról a
növényekről, amelyek a vízkorlátozások korában is fenntarthatók a magyar kertekben,
valamint egy 20 fajos listát azokról az inváziós fajokról, amelyeket kerülni kellene.

A listák tartalma kiváló, de folyó szövegben nehezen áttekinthető. Ez az oldal
ugyanezt az anyagot teszi kereshetővé és szűrhetővé — kategória, méret, fényigény,
vízigény, őshonosság és mérgezőség szerint —, fotókkal kiegészítve.

### Az oldal öt lapja

| Lap | Tartalom |
|---|---|
| **Ajánlott növények** | 100 klímatűrő faj, teljes szűrőrendszerrel |
| **Már nem fenntartható** | 6 régen népszerű faj, amelyeknek nagy a vízigénye (tuja, lucfenyő, nyír…) |
| **A mediterrán tévút** | 6 faj, amivel gyakran próbálják helyettesíteni — és miért nem működik |
| **Invazív – ne telepítsd** | a TOP 20-as lista, fásszárú/lágyszárú és uniós jegyzék szerint szűrve |
| **Forrás és módszertan** | forrásmegjelölés, adateredet, képlicencek |

---

## Forrás és jogi helyzet

Ez **nem hivatalos kiadvány**, és nem a szerző vagy a 24.hu terméke — rajongói
feldolgozás, amelynek egyetlen célja a lista jobb használhatósága.

- **Növénylista, kategóriák, jellemzések és az invazív indoklások:** Bardóczi Sándor
  főtájépítész munkája.
  Elsődleges forrás: [a szerző Facebook-bejegyzése](https://www.facebook.com/sandor.bardoczi/posts/pfbid0b2bJpSzT8kK5njYtyAW9bakt8uAJc28JJPKr9zxds5vatrVStaGUc4VUNmwr13Rbl)
  és az ahhoz fűzött saját kommentje.
- **Újságcikk-feldolgozás:** [Sokszínű vidék / 24.hu, 2026. 08. 17.](https://sokszinuvidek.24.hu/kertunk-portank/2026/08/17/kert-noveny-klimavaltozas-aszaly-hoseg/)
- **Fotók:** Wikimedia Commons közreműködői — a teljes, fajonkénti forrásjegyzék:
  [`KEPEK-FORRASOK.md`](KEPEK-FORRASOK.md). Minden kép szerzője és licence az oldalon
  is fel van tüntetve, a licencfeltételekre mutató linkkel.
- A cikkből **nem** használunk fel fotót (azok Getty Images képek).

Ha a szerző vagy a kiadó kifogásolja a feldolgozást, az oldal azonnal módosítható
vagy levehető.

---

## Adatvédelem

Az oldal **statikus, és nem gyűjt személyes adatot**:

- nincs űrlap, nincs regisztráció, nincs e-mail-cím bekérés
- nincs süti, nincs analitika, nincs nyomkövetés
- a növényképek a Wikimedia Commonsról töltődnek be (a Wikimédia Alapítvány
  adatkezelése szerint)
- a beágyazott Facebook-bejegyzés **csak külön kattintásra** töltődik be, előtte
  semmilyen adat nem megy a Meta felé

Az oldalon jelenleg **nincs visszajelzési felület** — ez tudatos döntés, hogy ne
kelljen adatkezelővé válni. Amíg nincs, a visszajelzés természetes helye a
megosztó Facebook-poszt kommentszekciója.

---

## Publikálás

Az `index.html` önálló, statikus fájl — nincs build lépés, nincs függőség.

1. Töltsd fel a repó gyökerébe.
2. **Settings → Pages** menüben állítsd a forrást a `main` branch gyökerére.
3. Írd át a fenti „Élő oldal" linket a saját címedre.

Ennyi. Az oldal működik.

---

## Fájlok

```
index.html            az oldal (egyetlen, önálló fájl – nincs build lépés)
KEPEK-FORRASOK.md     fajonkénti képforrás-jegyzék (szerző, licenc, eredeti fájl)
README.md             ez a fájl
_config.yml           GitHub Pages beállítás (az archiv/ nem kerül ki a weboldalra)
og-image.png          1200×630 megosztási kép (saját készítésű, nem Wikimedia)
robots.txt            keresőknek: minden indexelhető + sitemap-hivatkozás
sitemap.xml           az egyetlen publikus URL a keresőknek
archiv/               korábbi verziók, változatlanul megőrizve (lásd archiv/README.md)
```

Az `archiv/` mappa a repóban megmarad és a GitHubon böngészhető, de a publikált
weboldalra **nem** kerül ki — ezt a `_config.yml` `exclude` listája intézi.

---

## Karbantartási tudnivalók — figyelem, ha az `index.html` újragenerálódik

> Ez a szakasz annak szól, aki legközelebb hozzányúl az `index.html`-hez
> (Claude Cowork, Claude Code vagy ember). **Olvasd el, mielőtt felülírod a fájlt.**

Az `index.html` `<head>` szekciója tartalmaz egy **SEO/megosztás blokkot**, ami
nem a Cowork-ben készült oldalgenerálás része. Ha az `index.html`-t teljes
egészében újragenerálod, ez a blokk **elveszik**, és attól a ponttól a
Facebook-megosztás kép nélküli lesz, a Google pedig rossz kanonikus URL-t lát.
Újragenerálás után **másold vissza**:

```html
<link rel="canonical" href="https://udvariistvan2016-ui.github.io/klimaallo-kert/">
<meta property="og:url"        content="https://udvariistvan2016-ui.github.io/klimaallo-kert/">
<meta property="og:locale"     content="hu_HU">
<meta property="og:site_name"  content="Klímaálló kert">
<meta property="og:image"      content="https://udvariistvan2016-ui.github.io/klimaallo-kert/og-image.png">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt"  content="Klímaálló kert – szűrhető növénykalauz, Bardóczi Sándor főtájépítész listája alapján">
<meta name="twitter:card" content="summary_large_image">
```

A `<title>`, a `<meta name="description">`, az `og:title` és az `og:description`
már korábban is benne volt — azokat elég változatlanul hagyni.

### Mi változott a publikáláskor (2026-08-17)

| Változás | Miért |
|---|---|
| `_config.yml` új fájl | Az `archiv/` és a `PUBLIKALAS.md` a repóban marad, de a weboldalra nem kerül ki (Jekyll `exclude`). |
| README „Élő oldal" link | A `FELHASZNALONEV` helyére a valódi GitHub-név került. |
| `<head>`: canonical + `og:url`/`og:image`/`og:locale`/`og:site_name` + `twitter:card` | Megosztásnál legyen előnézeti kép; a keresőnek egyértelmű a kanonikus cím. |
| `og-image.png` új fájl | A megosztási kép **szándékosan saját készítésű** (a site színeivel), nem egy Wikimedia-fotó: a CC BY-SA képekhez attribúció kell, amit a Facebook-előnézet nem tud megjeleníteni. Ha átrajzolod, maradjon 1200×630. |
| `robots.txt`, `sitemap.xml` új fájlok | Semmi nincs tiltva, és a kereső megkapja az egyetlen publikus URL-t. |

Amihez **nem** nyúltunk: a növényadatok (`DATA` objektum), a szűrőlogika, a
kártyarenderelés és a kép-összehasonlító csúszka — azok maradtak, ahogy a
Cowork-ben elkészültek.

### Ha változik a repó neve vagy a GitHub-felhasználónév

Négy helyen szerepel beégetve a `https://udvariistvan2016-ui.github.io/klimaallo-kert/`
cím: `index.html` (canonical + `og:url` + `og:image`), `README.md`,
`robots.txt`, `sitemap.xml`. Mind a négyet át kell írni.

---

## Ismert korlátok / következő lépés

- A **fényigény-, vízigény- és méretbesorolás** jelenleg a szerző rövid
  megjegyzéséből és általános kertészeti ismeretből származtatott, tájékoztató
  jellegű érték. A következő lépés ezek feltöltése strukturált kertészeti
  adatbázisból (Missouri Botanical Garden Plant Finder, RHS Plant Finder), hogy
  minden érték mögött konkrét hivatkozás álljon.
- A **részletes adatlapok** (talajigény, növekedési erély, virágzási idő,
  beporzóbarát jelleg) jelenleg nem szerepelnek a kártyákon. Ezek a fenti
  adatbázis-lekéréssel együtt kerülnek be, kattintásra lenyíló blokkban — így a
  kártya kompakt marad. Szándékosan kimarad a kézzel összeszedett, pontatlan
  köztes kör.
- Az oldalon nincs visszajelzési felület; ha később mégis kell, olyan megoldás
  jön, ami a látogatótól nem kér fiókot és nem gyűjt személyes adatot.
- A képek jelenleg a Wikimedia Commonsról töltődnek be. Ha az oldal nagy
  forgalmat kap, érdemes a képeket a repóba másolni.
