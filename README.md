# Hidrin Seno — Portfolio

Responsive Portfolio mit React, TypeScript, Vinext, Three.js, GSAP/ScrollTrigger und Lenis.

## Funktionen
- Echtes GLB-Modell mit scrollgesteuerter Zerlegung und Mausreaktion.
- Sechs initiale Projekte, räumlicher Slider und eigene Projektseiten.
- Geschützter Projekt-Editor unter `/admin`: Bilder/Videos hochladen, Reihenfolge bearbeiten, Entwurf speichern und veröffentlichen.
- D1 speichert Projekte und Medienmetadaten; R2 speichert Uploads dauerhaft.
- Veröffentlichte Inhalte sind anonym erreichbar. Entwurfsmedien werden nur für den Admin ausgeliefert.
- Kein persönliches Porträt/Avatar, keine Semester-Navigation.
- Reduced Motion, responsive Layouts, dynamisches Laden der 3D-Bibliothek.

## Entwicklung
Node >=22.13, `npm ci`, `npm run dev`. Build: `npm run build`. Typecheck: `npx tsc --noEmit`.

Die Vorschau läuft auf http://localhost:5173. Für lokale Datenbanktests zunächst bauen, dann:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_shocking_onslaught.sql
```

Nur einmal auf einer leeren lokalen Datenbank ausführen. `.dev.vars` mit `ADMIN_EMAIL=seedy@sites.test` aktiviert das lokale Testkonto. Der Sites-Starter simuliert die Anmeldung ausschließlich lokal. Produktionsanmeldung erfolgt über den Sites-Dispatcher. Die Produktionsvariable `ADMIN_EMAIL` muss auf das Konto der Eigentümerin gesetzt werden, niemals auf das lokale Testkonto.

## Veröffentlichung
Die öffentliche Website läuft als Cloudflare-kompatibler Worker mit D1/R2 über Sites. GitHub dient als Quellcode-Repository. GitHub Pages allein unterstützt die serverseitige Anmeldung und Uploadverwaltung dieser Anwendung nicht. Keine Geheimnisse, `.dev.vars`, Datenbankdateien oder Build-Ausgaben in Git einchecken.

## Inhalte
`lib/initial-projects.ts` enthält die Startprojekte. Änderungen im Editor überschreiben diese datengestützt. Als Entwurf gespeicherte Startprojekte sind anschließend nicht mehr öffentlich sichtbar. Reihenfolge wird über eine Zahl bestimmt. Löschen von Medien aus einem Projekt entfernt die Referenz, nicht die gespeicherte Originaldatei.

`public/portfolio` enthält ausgewählte Nutzerdateien, gerenderte PDF-Seiten und das approximative 3D-Stuhlmodell. Der persönliche Lebenslauf als PDF und das Porträt werden nicht öffentlich ausgeliefert. Autorenrechte an Nutzerarbeiten verbleiben bei den jeweiligen Rechteinhabern.

## Stand und Grenzen
Die 3D-Darstellung verwendet Three.js, nicht Spline: ein nativer Spline-Export wurde nicht geliefert. Premium-Code aus AnimMasterLib, Skiper UI oder VengeanceUI wurde nicht übernommen. Die Effekte sind eigene Implementierungen. Video-Uploads: JPG/PNG/WebP/MP4/WebM bis 40 MB; Text wird als Klartext gerendert. Originale Handschrift, Maße und Materialstärken des 3D-Stuhls sind nur teilweise rekonstruiert.

## Geprüft
Produktionsbuild und TypeScript-Prüfung bestanden. Lokaler Integrationstest: anonyme Schreibzugriffe abgelehnt, Origin-Prüfung, Upload, private Entwürfe, Veröffentlichung, öffentliche Medien und Rücknahme. Desktop und mobile Ansicht im Browser geprüft. End-to-End-Testskript siehe `tests/integration.py`; nur gegen lokale Testdaten ausführen.
