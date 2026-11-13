# Publicación

El proyecto está preparado para Pages, incluso bajo `/atvio-launcher/`, porque todos los recursos internos usan rutas relativas.

No se creó un repositorio ni se publicó: `gh auth status` indica que el token del entorno es inválido y no hay una conexión GitHub utilizable. No envíes tokens por chat. Puedes autorizar GitHub en la configuración del entorno y dar el nombre de cuenta/repositorio para completar el despliegue en una sesión posterior.

Alternativa mínima desde tu computadora con Git y GitHub CLI autenticados:

```sh
git init -b main
git add .
git commit -m "Implementar ATVIO Launcher"
gh repo create atvio-launcher --public --source=. --remote=origin
git push -u origin main
```

En el repositorio: Settings → Pages → Build and deployment → Source → GitHub Actions. Si el primer workflow falla por falta de Pages habilitado, vuelve a ejecutar Verificar y publicar Pages desde Actions. Revisa su resultado y abre la URL que muestra el job deploy. No consideres publicado el sitio hasta que cargue correctamente. El workflow comprueba HTTP y el título; la revisión física en la TV sigue pendiente.

Pages normalmente usa HTTPS y puede redirigir HTTP a HTTPS. Por tanto, **el servidor HTTP local es la opción principal para esta TV antigua**. Un fallo TLS de Pages no implica un fallo del launcher. El sitio no necesita servidor de backend, npm ni conexiones externas para cargar su interfaz.
