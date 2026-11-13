# Investigación técnica: ATVIO 55D1620 / MT5655

Fecha: 13 de noviembre de 2026. Investigación documental y de proyectos públicos; sin acceso de red a la TV, volcado de firmware, consola serie ni prueba física. Modelo, chasis, firmware y Linux propietario son datos aportados por el usuario, no leídos del dispositivo. La carga de una página HTTP está confirmada por su prueba previa; no demuestra compatibilidad completa con este proyecto.

## Criterio

**Confirmada** significa evidencia concreta para el alcance indicado. **Experimental** describe una vía existente en otras plataformas que requiere validar sus condiciones en esta TV. **No demostrada** significa que no se encontró evidencia aplicable a V8-MT56BNA-LF1V027; no significa imposibilidad absoluta. Compartir SoC, marca o prefijo no demuestra compatibilidad binaria.

| Posibilidad | Clasificación para esta TV | Evidencia y lo que falta |
| --- | --- | --- |
| Cargar HTML mediante HTTP local | Confirmada por el usuario | Su prueba previa funcionó. Falta ejecutar este launcher y obtener el diagnóstico real. |
| Navegar este proyecto con flechas y OK | Experimental en la TV; confirmada en Chromium | Necesita eventos keydown entregados por el navegador y eventualmente ajustar códigos. |
| Guardar favorito o página inicial del navegador | Experimental | Depende de las opciones reales del navegador. Un favorito no sustituye el Home del sistema. |
| Arrancar el launcher al encender | No demostrada | No se encontró una opción o mecanismo documentado para iniciar una URL en este firmware. Power on mode en el manual no documenta URL de arranque. |
| Integrar directamente con Linux o sustituir el shell | No demostrada | Harían falta identificación del sistema de inicio, navegador y parámetros, privilegios autorizados, montaje y firmas, dependencias y mecanismo de recuperación. No se ha confirmado shell, SSH, Telnet, ADB o root. |
| Lanzar apps nativas desde la página | No demostrada; deshabilitada | No hay API, esquema de URI ni identificadores verificados para MT56BNA V027. No se generan enlaces ficticios. |
| Usar DIAL desde un equipo local auxiliar | Experimental como línea de investigación | Existe protocolo y código de referencia; falta confirmar que esta TV anuncia el servicio y acepta cada app. No es una API web universal. La página no puede hacer descubrimiento SSDP UDP ordinario; además hay restricciones de origen/CORS y posible contenido mixto. No se incluyó servidor puente ni se enviaron comandos a la TV. |
| Instalar aplicaciones adicionales | No demostrada | Requiere catálogo aún operativo y compatible, SDK/paquetes del fabricante o mecanismo oficial. Una tienda web no demuestra instalación nativa. No asumir APK, Play Store o ADB en Linux propietario. |
| Optimizar servicios o eliminar paquetes del sistema | No demostrada | Sin medición de procesos/memoria ni documentación exacta no se pueden seleccionar servicios prescindibles. No se incluyen scripts de debloat. |
| Reducir el coste de esta interfaz | Confirmada en el proyecto | Seis archivos públicos, 16.355 bytes al entregar; sin librerías de ejecución, recursos externos obligatorios ni animaciones. Esto no mide ni acelera los procesos originales del sistema. |
| Flashear firmware TCL parecido | No demostrada y fuera de alcance | No hay copia original verificada, identificación de panel/proyecto ni recuperación validada. No se descargó, generó o modificó firmware. |

## Fuentes leídas y límites

1. **Manual TCL 55D1620, familia MT56**: [página 7](https://www.manualslib.com/manual/2627321/Tcl-55d1620.html?page=7). Identifica la especificación MT56 y enumera ajustes de fábrica como Power on mode y USB Clone. El índice asocia MT5655-LA. Es una correspondencia documental relevante del modelo, pero no prueba que el firmware del equipo ATVIO sea idéntico. No documenta instalar launchers ni iniciar URLs. No se usaron menús de servicio.
2. **Manual TCL 32D2930/MT56E1-LA**: [PDF](https://manuals.plus/m/ff8c528c5beda7e13e98471d0dda772a45050edb6a80447b7a180b85848fb4b7.pdf). Contiene MT5655 y V8-MT56551-LF1V003. Es otra variante; no se interpreta como soporte de MT56BNA V027.
3. **Nota TCL NT563 / MT5655**: [PDF](https://s3.amazonaws.com/helpscout.net/docs/assets/5e57101a04286364bc95ebc4/attachments/5ecbc5be2c7d3a5ea54bb42f/NT563-6500S6000-au-V189.pdf). Describe actualizaciones oficiales para otros chasis. No es un procedimiento de recuperación verificado de la ATVIO. No utilizar sus archivos en este equipo.
4. **Netflix/dial-reference**: [repositorio y README](https://github.com/Netflix/dial-reference). Confirma que DIAL existe como protocolo de descubrimiento y lanzamiento desde segundas pantallas. No lista compatibilidad verificada con esta ATVIO. Que una TV tenga Netflix no prueba DIAL ni acceso a su app desde el navegador.
5. **Gathin23/cleanyourtv**: [ejemplos](https://github.com/Gathin23/cleanyourtv/blob/main/examples/README.md). El contenido consultado trata Android/Google TV, incluyendo MT9655 Android 14 y restricciones específicas por modelo. No se puede trasladar su debloat o reemplazo de launcher a MT5655 con Linux propietario.
6. **Listado de repuesto ATVIO con MT56BNA**: [Electrónica Morelos](https://electronicamorelos.com/producto/main-40-mt56ee-413512). Menciona V8-MT56BNA-LF1V066 en ATV-32SM y advierte diferencias por marca/modelo. Es una fuente comercial secundaria, no documentación de API ni firmware intercambiable con 55D1620 V027.
7. **Fullscreen API**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API). La solicitud depende de soporte y permiso del navegador. El proyecto detecta variantes con prefijo y controla el rechazo.
8. **GitHub Pages**: [workflows oficiales](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Fundamenta el workflow incluido, no certifica TLS en el navegador antiguo.

Se buscaron expresiones exactas MT5655, MT56BNA, V8-MT56BNA-LF1V027 y 55D1620, además de proyectos GitHub sobre lanzamiento y Linux TCL. No se identificó un proyecto con compatibilidad demostrada para el firmware exacto. Un resultado indexado de VIDAA menciona MT5655/5657 y Opera Presto 2.12; la URL del PDF devolvió 404 al abrirla. No se emplea ese fragmento como confirmación del motor de esta TV.

## Qué haría falta para avanzar

Primero obtener desde Diagnóstico el agente real, resolución, códigos y comportamiento del almacenamiento/pantalla completa. Evaluar la navegación antes de cualquier integración. El software no identifica el firmware por user-agent ni lo adivina.

Para inicio automático, verificar en la interfaz normal del navegador si admite página inicial y restauración de sesión. Para integración Linux, se necesitaría documentación específica o acceso de diagnóstico autorizado y de solo lectura, identificar placa, panel, Project ID, CPU/ABI, kernel, sistema de inicio, rutas y permisos. No se proporcionan comandos genéricos de persistencia sin esos datos.

Para aplicaciones nativas, la siguiente investigación sería comprobar documentalmente o mediante diagnóstico autorizado si existe un servicio DIAL y qué apps declara, sin escaneos indiscriminados ni explotación. Si no existe una interfaz oficial, mantener los botones nativos del control como vía de acceso.

Para instalación adicional, confirmar plataforma y estado de la tienda del dispositivo. Los paquetes Android no sirven por compartir un kernel Linux. Para rendimiento original, medir primero y usar únicamente ajustes normales reversibles (por ejemplo, conexión cableada si la lentitud es de red); no prometer mejora de CPU por cambiar DNS ni borrar servicios desconocidos.

Antes de cualquier modificación de firmware serían imprescindibles una copia íntegra original verificada con hashes, identificación exacta de memoria/placa/panel, respaldo de datos únicos, un método de restauración documentado y comprobado y autorización explícita. Este proyecto no realiza esa modificación.
