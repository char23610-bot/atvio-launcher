"""Servidor HTTP local: sirve únicamente los archivos públicos."""
import argparse
import functools
import http.server
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = {'index.html', 'settings.html', 'diagnostics.html', 'assets/style.css', 'assets/app.js', 'assets/config.js'}

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        from urllib.parse import unquote, urlsplit
        path = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
        if path not in PUBLIC:
            self.send_error(404)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bind', default='0.0.0.0')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    server = http.server.ThreadingHTTPServer((args.bind, args.port), functools.partial(Handler, directory=str(ROOT)))
    print('ATVIO Launcher: http://%s:%s/ (Ctrl+C para detener)' % (args.bind, args.port), flush=True)
    server.serve_forever()
