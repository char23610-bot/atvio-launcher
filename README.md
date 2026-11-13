# ATVIO Launcher

Inicio web ligero para una Smart TV ATVIO 55D1620, MT5655, V8-MT56BNA-LF1V027. HTML, CSS y JavaScript ES5; sin frameworks, fuentes remotas ni dependencias de ejecución. No sustituye el firmware ni el menú Home de la TV.

## Abrir en la televisión

1. Descarga y descomprime el proyecto en la computadora que ya usaste para tu prueba HTTP.
2. Dentro de `atvio-launcher`, ejecuta `python3 scripts/serve.py` (Windows: `py scripts/serve.py`). No requiere npm.
3. Conecta computadora y TV a la misma red. Abre en el navegador de la TV `http://IP-DE-TU-COMPUTADORA:8000/`. Obtén esa IPv4 con `ipconfig` en Windows o los ajustes de red de tu equipo. Autoriza el puerto 8000 en el firewall solo para la red privada si es necesario.
4. Guarda esa dirección como favorito en el navegador, si lo permite. Mantén el servidor encendido. Ctrl+C lo detiene.

La computadora en Codex Cloud no es tu servidor de la red doméstica. El servidor incluido sirve únicamente las seis rutas públicas y usa HTTP, sin autenticación; no abras el puerto del router hacia Internet.

## Uso

Flechas mueven el foco según la posición visual, OK abre el elemento, Tab también funciona. Atrás en las páginas auxiliares vuelve al inicio y en el inicio vuelve al menú. No se interceptan volumen, encendido ni teclas desconocidas. Las teclas que el navegador reserve no se pueden capturar. El editor de texto conserva sus teclas normales; sal con Tab o el puntero al terminar.

Favoritos muestra los accesos marcados. Configurar permite guardar, importar y copiar JSON; Restablecer descarta los cambios locales. Hay hasta 24 accesos y códigos de teclas personalizables sin duplicados. Edita `assets/config.js` en la computadora para configurar sin escribir en la TV. Si ya guardaste configuración en el navegador, restablécela para usar los nuevos valores del archivo. No guardes contraseñas ni tokens en URLs.

El almacenamiento es por navegador y origen (protocolo, IP y puerto); puede perderse al limpiar datos o cambiar la dirección del servidor. Sin almacenamiento se usan los valores del archivo y se avisa. La pantalla completa necesita una pulsación y autorización del navegador; no se garantiza.

Los accesos YouTube y otros son **sitios web**. Sus requisitos de TLS, JavaScript, vídeo o DRM pueden impedir que funcionen en la TV. El launcher y sus recursos internos funcionan por HTTP; no convierten servicios externos modernos en compatibles. Netflix y YouTube nativos están deshabilitados y se abren desde el sistema original.

## Diagnóstico en la TV

Abre Diagnóstico, pulsa flechas, OK y Atrás y anota los keyCode. Ajusta `keys` en la configuración cuando sea necesario. El informe muestra agente, resolución, almacenamiento probado, API de pantalla completa y soporte de vídeo declarado. No transmite datos. La presencia de una API no certifica su funcionamiento. No se realizó una prueba física en esta ATVIO.

## Desarrollo y pruebas

Requiere Node 22+, Python 3 y Chromium para desarrollo; la TV no necesita ninguno.

```sh
npm ci
npx playwright install --with-deps chromium
CHROMIUM_PATH=$(node -e "process.stdout.write(require('playwright').chromium.executablePath())") npm test
python3 scripts/package.py
```

Si existe `/usr/bin/chromium`, basta `npm test`. Las pruebas analizan ambos scripts con Acorn en modo ES5 y comprueban recursos por HTTP, flechas/OK/Atrás, geometría, favoritos, persistencia, validación, códigos personalizados, diagnóstico y recuperación sin almacenamiento o con datos corruptos. Generan capturas en `artifacts/`. Chromium actual no emula Opera/Presto antiguo: ES5 es una comprobación sintáctica, no una certificación del dispositivo. El diseño usa inline-block, sin Grid, Flexbox, variables CSS, animaciones ni APIs de red modernas.

`python3 scripts/package.py` genera `dist/` (solo sitio) y `atvio-launcher.zip` (fuentes y documentación). Los scripts Python son herramientas de desarrollo; no se ejecutan en la televisión.

## GitHub Pages

Consulta [publicación](docs/PUBLICACION.md). El workflow verifica antes de desplegar y comprueba la URL devuelta. No hay URL pública verificada en esta entrega.

Consulta [investigación técnica](docs/INVESTIGACION.md) y [validación](docs/VALIDACION.md). Licencia MIT.
