"""Prepara sitio estático y archivo ZIP de código reproducible."""
from pathlib import Path
import shutil
import zipfile
ROOT = Path(__file__).resolve().parent.parent
out = ROOT / 'dist'
out.mkdir(exist_ok=True)
for name in ('index.html', 'settings.html', 'diagnostics.html'):
    shutil.copy2(ROOT / name, out / name)
shutil.copytree(ROOT / 'assets', out / 'assets', dirs_exist_ok=True)
(out / '.nojekyll').touch()
with zipfile.ZipFile(ROOT / 'atvio-launcher.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(ROOT.rglob('*')):
        rel = path.relative_to(ROOT)
        if path.is_file() and not any(p in ('node_modules', '.git', 'dist', 'artifacts') for p in rel.parts) and path.suffix != '.zip':
            archive.write(path, 'atvio-launcher/' + str(rel))
print('Listos: dist/ y atvio-launcher.zip')
