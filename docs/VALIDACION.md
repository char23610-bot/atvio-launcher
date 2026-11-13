# Validación

Ejecutado en Codex Cloud el 13 de noviembre de 2026: `npm test`, con Node 24, Python 3.12 y Chromium del entorno. Resultado: **30 comprobaciones correctas**, sin errores JavaScript. Las pruebas requirieron ejecución fuera del sandbox porque este bloqueaba HTTP de loopback; la revisión automática autorizó la ejecución.

- Acorn valida ambos archivos públicos con `ecmaVersion: 5`.
- Los seis recursos públicos responden mediante HTTP; package.json no se expone por el servidor incluido.
- Flechas en menú y cuadrícula, OK, Atrás y código OK personalizado funcionan.
- Favoritos, guardado, persistencia, restablecimiento y rechazo de URLs ejecutables/códigos duplicados funcionan.
- Diagnóstico y registro visible de teclas funcionan.
- La interfaz conserva cuatro columnas en 1280×720 y navega en dos columnas a 800×600.
- Funciona con almacenamiento bloqueado y con JSON guardado corrupto.
- No se detectaron peticiones externas obligatorias ni errores JavaScript.

Se generaron `artifacts/home-1080.png` y `artifacts/home-720.png`. Se inspeccionó visualmente la captura de 1920×1080: foco visible, textos y tarjetas dentro de la zona de seguridad.

Estas pruebas usan Chromium moderno, no emulan Presto ni el firmware MT56BNA. No se probó físicamente en la ATVIO. Tampoco se certificó reproducción externa, DRM, apertura nativa, pantalla completa real en la TV o arranque automático. La compatibilidad sintáctica ES5 no certifica las APIs DOM del navegador.

La publicación permanece pendiente: `gh auth status` informó token inválido. No hay repositorio creado, workflow remoto ejecutado ni URL pública comprobada.
