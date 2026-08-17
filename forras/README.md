# Forrás (generátor)

Az `index.html` **nem kézzel szerkesztendő** — ez a két fájl állítja elő:

| Fájl | Mit tartalmaz |
|---|---|
| `data.js` | A növényadatok: 100 ajánlott, 20 invazív, 6 nem fenntartható, 6 mediterrán faj + a műfű. Magyar és latin név, a szerző megjegyzése, őshonosság, mérgezőség, fény/víz/méret besorolás, képfájl és licenc. |
| `build.js` | A HTML és a `KEPEK-FORRASOK.md` legenerálása. Itt van a teljes CSS, a kártyasablonok, a szűrőlogika és a `<head>` SEO/megosztás blokkja. |

## Futtatás

```bash
cd forras
node build.js ..
```

Ez felülírja a repó gyökerében az `index.html`-t és a `KEPEK-FORRASOK.md`-t.
Nincs npm-függőség, elég egy Node.js.

## Ha változik a repó címe

A `build.js` elején egyetlen konstans:

```js
const SITE_URL = "https://udvariistvan2016-ui.github.io/klimaallo-kert/";
```

Ebből épül a `canonical`, az `og:url` és az `og:image`. Rajta kívül még három
helyen szerepel a cím: `README.md`, `robots.txt`, `sitemap.xml`.

## Miért van ez a repóban?

Hogy az `index.html` újragenerálható és ellenőrizhető legyen. A `_config.yml`
kizárja ezt a mappát a publikált weboldalról — a GitHubon böngészhető, a
weblapra nem kerül ki.
