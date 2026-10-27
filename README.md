# Paisanu Jabalí

Guía de bolsillo del jabalí asturiano, en pixel art. App Android local (sin permiso de Internet): un `WebView` que carga una web empaquetada en `app/src/main/assets/www`.

Incluye ficha con fuentes, mapa esquemático de Asturias con las zonas del plan de jabalí, tres sonidos (amenaza, celo, piara), consejos de convivencia, galería de fotos, modo día/noche y decoración pixel art (jabalí andando, hórreo, árboles, frutos).

## Obtener el APK

1. Sube el proyecto a un repositorio de GitHub (rama `main`).
2. Pestaña **Actions**: se ejecuta el workflow **Compilar APK** (o lánzalo a mano).
3. Al terminar, ve a **Releases** y descarga `paisanu-jabali.apk` desde el móvil.
4. Ábrelo y permite «instalar apps desconocidas» para el navegador si el móvil lo pide.

## Personalizar

- **Fotos:** la galería usa las imágenes de `assets/www/fotos/` listadas en `fotos.js` (comprueba que tienes derechos para usarlas). Para añadir más, copia las imágenes a `app/src/main/assets/www/fotos/` y añade una línea por foto en `fotos.js`.
- **Sonidos reales:** sustituye `amenaza.ogg`, `celo.ogg` y `piara.ogg` en `assets/www/audio/` (los actuales son sintéticos).
- **Textos y datos:** `assets/www/index.html` (cada dato lleva su fuente) y `js/app.js` (datos curiosos).
- **Icono:** `res/drawable-nodpi/ic_launcher_foreground.png` sobre fondo `#2B2621`. `icono-512.png` es la versión cuadrada.

## Estructura

- `MainActivity.kt`: aloja el WebView y abre los enlaces externos en el navegador.
- `assets/www/`: `index.html`, `css/app.css`, `js/app.js`, `img/` (sprites, escenas, mapa), `audio/`, `fonts/pixelpaisanu.ttf` (fuente pixel propia).

## Límites conocidos

- El mapa es esquemático: contorno y posiciones aproximadas, dibujados a mano.
- Las cifras de tamaño y peso son del Montseny (Cataluña); no se encontraron cifras asturianas.
- No incluye el calendario de caza 2026-27: consulta la Disposición General de Vedas vigente.
