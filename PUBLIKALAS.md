# Publikálás GitHub Pages-re

Nyiss terminált (vagy Claude Code-ot) **ebben a mappában**, és futtasd az alábbiakat.

---

## 1. Egyszeri beállítás — első feltöltés

### GitHub CLI-vel (ha van `gh`) — ez a leggyorsabb

```bash
git init
git add .
git commit -m "Klímaálló kert – szűrhető növénykalauz"
git branch -M main

# repó létrehozása + remote beállítása + push, egy lépésben:
gh repo create klimaallo-kert --public --source=. --remote=origin --push
```

### `gh` nélkül

Először hozd létre a repót a <https://github.com/new> oldalon `klimaallo-kert`
néven — **üresen**, README/licenc/gitignore nélkül. Utána:

```bash
git init
git add .
git commit -m "Klímaálló kert – szűrhető növénykalauz"
git branch -M main
git remote add origin https://github.com/FELHASZNALONEV/klimaallo-kert.git
git push -u origin main
```

---

## 2. GitHub Pages bekapcsolása

A repó oldalán: **Settings → Pages → Build and deployment**

- Source: `Deploy from a branch`
- Branch: `main`, mappa: `/ (root)` → **Save**

Egy-két perc múlva él:
`https://FELHASZNALONEV.github.io/klimaallo-kert/`

Parancssorból ugyanez (opcionális):

```bash
gh api -X POST "repos/FELHASZNALONEV/klimaallo-kert/pages" \
  -f "source[branch]=main" -f "source[path]=/"
```

---

## 3. Utolsó simítás

A `README.md` első sorában cseréld ki a `FELHASZNALONEV` szót a saját
GitHub-neved re, hogy az „Élő oldal" link működjön:

```bash
# Linux/macOS/Git Bash:
sed -i 's/FELHASZNALONEV/sajat-github-neved/g' README.md
git commit -am "Élő oldal linkje" && git push
```

Windows PowerShellben:

```powershell
(Get-Content README.md) -replace 'FELHASZNALONEV','sajat-github-neved' | Set-Content README.md
git commit -am "Élő oldal linkje"; git push
```

---

## 4. Későbbi frissítések

```bash
git add .
git commit -m "mi változott"
git push
```

---

## Megjegyzések

- **Az `archiv/` mappa is felkerül.** Ez szándékos: így a korábbi verziók a
  weben is visszanézhetők, nem csak a git history-ban. Ha nem szeretnéd, tedd
  be egy `.gitignore`-ba az `archiv/` sort a legelső commit előtt.
- **Nem kell build lépés.** Az `index.html` önálló fájl, minden benne van.
- **A repó legyen `public`**, különben a GitHub Pages ingyenes csomagban nem
  szolgálja ki az oldalt.
- Ha a Pages 404-et ad az első percekben, várj — az első deploy néha 2–5 perc.
