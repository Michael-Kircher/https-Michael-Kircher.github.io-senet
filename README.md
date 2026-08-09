# Senet Web App

Eine browserbasierte Version des antiken ägyptischen Brettspiels Senet. Dieses Projekt ist für GitHub Pages optimiert und kann nach dem Push in den `main`-Branch direkt als statische Website ausgegeben werden.

## GitHub Pages Vorbereitung

- `vite.config.ts` ist auf den Repository-Pfad `'/https-Michael-Kircher.github.io-senet/'` gesetzt.
- Es gibt eine GitHub Actions Pipeline unter `.github/workflows/deploy.yml`, die bei jedem Push in `main` baut und `dist` nach GitHub Pages deployt.
- Es wurden statische Dateien angelegt:
  - `index.html`
  - `404.html`
  - `css/style.css`
  - `js/app.js`
  - `assets/`, `fonts/`, `icons/`
- Alle Pfade sind relativ und GitHub Pages-kompatibel.

## Struktur

```
/
│ index.html
│ README.md
│ 404.html
│
├── assets/
├── css/
│     style.css
├── js/
│     app.js
├── fonts/
└── icons/
```

## Wichtige Hinweise

- Keine absoluten lokalen Pfade werden verwendet.
- Die statischen Assets sind relativen Pfaden zugeordnet.
- Der eigentliche React- und Vite-Build generiert die produktiven Assets in `dist`.
- GitHub Actions veröffentlicht `dist` auf GitHub Pages, sodass die App im Browser läuft.

## Deployment

1. Push den Code in den `main`-Branch.
2. GitHub Actions erstellt `npm run build` und deployt die Dateien.
3. Die Seite sollte erreichbar sein unter:
   `https://Michael-Kircher.github.io/https-Michael-Kircher.github.io-senet/`

## Lokale Entwicklung

1. Installiere Abhängigkeiten:
   `npm install`
2. Starte die Entwicklung:
   `npm run dev`

## Statische OAuth-Weiterleitungsseite

Das Projekt enthält eine statische Weiterleitungsseite für OAuth-Autorisierungen, erreichbar unter `/oauth/authorize/` (Datei: `oauth/authorize/index.html`). Diese Seite leitet den Browser zur GitHub-OAuth-Autorisierungs-URL weiter und benötigt nur eine öffentliche `client_id` (kein Client Secret). Hinweise:

- Die Seite selbst führt keinen Token-Austausch durch — ein Backend ist für den sicheren Austausch des Authorization Codes mit dem Access Token erforderlich.
- Du kannst die Seite manuell mit Query-Parametern aufrufen, z. B.:

```
https://<dein-username>.github.io/<repo-path>/oauth/authorize/?client_id=DEINE_CLIENT_ID&redirect_uri=https://example.com/callback&scope=read:user
```

- Oder rufe die Seite auf und fülle die Felder `Client ID` und `Redirect URI` aus. Die Seite generiert optional einen `state`-Parameter und leitet zur folgenden URL weiter:

```
https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&scope=...&state=...
```

Konfiguration GitHub OAuth App:

1. Erstelle in GitHub unter Settings → Developer settings → OAuth Apps eine neue App.
2. Trage bei "Authorization callback URL" die gewünschte `redirect_uri` ein (muss später mit der Anfrage übereinstimmen).
3. Verwende nur die `client_id` auf der statischen Seite; das `client_secret` darf niemals in öffentlich zugänglichen Dateien landen.

Wenn du eine serverseitige Implementierung (Token-Austausch) benötigst, empfehle ich eine kleine Serverless-Funktion (Vercel/Netlify/AWS) oder einen Backend-Endpunkt, der das `client_secret` sicher verwahrt.
