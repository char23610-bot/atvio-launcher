(function () {
    'use strict';
    var storeKey = 'atvio.launcher.v1', config, storageOK = false, storageNote = '', favoriteOnly = false;
    var page = document.body.getAttribute('data-page'), keyLines = [];
    function byId(id) { return document.getElementById(id); }
    function text(node, value) { if (node) { if ('textContent' in node) { node.textContent = value; } else { node.innerText = value; } } }
    function status(value) { text(byId('status'), value); }
    function listen(node, event, fn) { if (node.addEventListener) { node.addEventListener(event, fn, false); } else { node.attachEvent('on' + event, fn); } }
    function clone(value) { return JSON.parse(JSON.stringify(value)); }
    function validate(value) {
        var i, j, names = ['left', 'up', 'right', 'down', 'ok', 'back'], used = {}, app, codes;
        if (!value || value.version !== 1 || Object.prototype.toString.call(value.apps) !== '[object Array]' || value.apps.length > 24 || !value.keys) { throw new Error('Formato inválido: version 1, apps (máximo 24) y keys requeridos.'); }
        for (i = 0; i < value.apps.length; i += 1) {
            app = value.apps[i];
            if (!app || typeof app.name !== 'string' || !app.name.replace(/\s/g, '') || app.name.length > 60 || typeof app.url !== 'string' || app.url.length > 2048 || !/^https?:\/\/[^\s\/?#]+[^\s]*$/i.test(app.url) || /[<>"\\\x00-\x20]/.test(app.url) || typeof app.favorite !== 'boolean') { throw new Error('Acceso inválido: nombre, URL HTTP(S) y favorite booleano requeridos.'); }
        }
        for (i = 0; i < names.length; i += 1) {
            codes = value.keys[names[i]];
            if (Object.prototype.toString.call(codes) !== '[object Array]' || !codes.length || codes.length > 12) { throw new Error('Cada acción necesita de 1 a 12 códigos.'); }
            for (j = 0; j < codes.length; j += 1) {
                if (typeof codes[j] !== 'number' || codes[j] < 1 || codes[j] > 65535 || Math.floor(codes[j]) !== codes[j] || used[codes[j]]) { throw new Error('Códigos enteros de 1 a 65535, sin duplicados.'); }
                used[codes[j]] = true;
            }
        }
        return value;
    }
    config = clone(window.ATVIO_DEFAULTS);
    try {
        window.localStorage.setItem(storeKey + '.probe', '1'); window.localStorage.removeItem(storeKey + '.probe'); storageOK = true;
        if (window.localStorage.getItem(storeKey)) { config = validate(JSON.parse(window.localStorage.getItem(storeKey))); }
    } catch (error) { storageNote = 'Configuración local no disponible o inválida; se usan valores del servidor.'; }
    function fullscreen() {
        var root = document.documentElement, fn = root.requestFullscreen || root.webkitRequestFullscreen || root.webkitRequestFullScreen || root.mozRequestFullScreen || root.msRequestFullscreen, result;
        if (!fn) { status('Pantalla completa no disponible en este navegador.'); return; }
        try { result = fn.call(root); status('Solicitud enviada; el navegador decide si la permite.'); if (result && result.then) { result.then(function () { status('Pantalla completa activada.'); }, function () { status('El navegador rechazó la pantalla completa.'); }); } } catch (error) { status('El navegador rechazó la pantalla completa.'); }
    }
    function controls() { return document.querySelectorAll('a[href], button, textarea'); }
    function focusFirst() { var list = controls(); if (list.length) { list[0].focus(); } }
    function render() {
        var box = byId('apps'), i, app, link, symbol, title, info, count = 0;
        while (box.firstChild) { box.removeChild(box.firstChild); }
        for (i = 0; i < config.apps.length; i += 1) {
            app = config.apps[i]; if (favoriteOnly && !app.favorite) { continue; }
            link = document.createElement('a'); link.href = app.url; link.className = 'tile';
            symbol = document.createElement('span'); symbol.className = 'symbol'; text(symbol, app.name.charAt(0).toUpperCase()); link.appendChild(symbol);
            title = document.createElement('strong'); text(title, app.name); link.appendChild(title);
            info = document.createElement('small'); text(info, app.favorite ? 'Favorito · Sitio web' : 'Sitio web'); link.appendChild(info); box.appendChild(link); count += 1;
        }
        if (!count) { text(box, 'No hay accesos en esta vista. Añádelos en Configurar.'); box.style.fontSize = '22px'; } else { box.style.fontSize = ''; }
        status(favoriteOnly ? 'Mostrando favoritos.' : 'Los sitios externos pueden requerir un navegador más reciente o HTTPS.');
    }
    function actionFor(code) { var name, i; for (name in config.keys) { if (Object.prototype.hasOwnProperty.call(config.keys, name)) { for (i = 0; i < config.keys[name].length; i += 1) { if (config.keys[name][i] === code) { return name; } } } } return ''; }
    function move(direction) {
        var list = controls(), active = document.activeElement, rect, best = null, score = Infinity, i, r, dx, dy, candidate, vertical = direction === 'up' || direction === 'down';
        if (!active || active === document.body) { focusFirst(); return; }
        rect = active.getBoundingClientRect();
        for (i = 0; i < list.length; i += 1) {
            if (list[i] === active || list[i].disabled) { continue; } r = list[i].getBoundingClientRect(); if (!r.width && !r.height) { continue; }
            dx = (r.left + r.right - rect.left - rect.right) / 2; dy = (r.top + r.bottom - rect.top - rect.bottom) / 2;
            if ((direction === 'left' && dx >= -1) || (direction === 'right' && dx <= 1) || (direction === 'up' && dy >= -1) || (direction === 'down' && dy <= 1)) { continue; }
            candidate = vertical ? Math.abs(dy) + Math.abs(dx) * 3 : Math.abs(dx) + Math.abs(dy) * 6;
            if (candidate < score) { score = candidate; best = list[i]; }
        }
        if (best) { best.focus(); }
    }
    if (page === 'home') {
        render();
        (function clock() { var now = new Date(); text(byId('clock'), ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2)); window.setTimeout(clock, 30000); }());
    }
    if (page === 'settings') {
        byId('config').value = JSON.stringify(config, null, 2);
        listen(byId('settings'), 'submit', function (event) {
            event = event || window.event; if (event.preventDefault) { event.preventDefault(); } event.returnValue = false;
            try { var next = validate(JSON.parse(byId('config').value)); if (!storageOK) { throw new Error('Almacenamiento no disponible. Edita assets/config.js en el servidor.'); } window.localStorage.setItem(storeKey, JSON.stringify(next)); config = next; status('Configuración guardada.'); } catch (error) { status(error.message); }
        });
        listen(byId('reset'), 'click', function () { try { window.localStorage.removeItem(storeKey); config = clone(window.ATVIO_DEFAULTS); byId('config').value = JSON.stringify(config, null, 2); status('Valores del servidor restaurados.'); } catch (error) { status('No se pudo restablecer el almacenamiento.'); } });
    }
    if (page === 'diagnostics') {
        var root = document.documentElement, video = document.createElement('video'), report = [];
        report.push('ATVIO Launcher 1.0 · ' + new Date().toUTCString());
        report.push('Agente: ' + navigator.userAgent, 'Página: ' + window.location.protocol + '//' + window.location.host, 'Pantalla: ' + screen.width + ' x ' + screen.height, 'Ventana: ' + root.clientWidth + ' x ' + root.clientHeight);
        report.push('JSON: ' + (typeof JSON !== 'undefined'), 'querySelectorAll: ' + !!document.querySelectorAll, 'Almacenamiento (escritura real): ' + storageOK, 'Pantalla completa (API detectada): ' + !!(root.requestFullscreen || root.webkitRequestFullscreen || root.webkitRequestFullScreen || root.mozRequestFullScreen || root.msRequestFullscreen));
        report.push('Vídeo H.264 (declarado): ' + (video.canPlayType ? video.canPlayType('video/mp4; codecs="avc1.42E01E"') || 'no' : 'sin API'), 'Conexión informada: ' + navigator.onLine, 'Apps nativas: deshabilitadas; sin integración verificada');
        text(byId('report'), report.join('\n'));
        listen(byId('clear'), 'click', function () { keyLines = []; text(byId('keys'), 'Esperando teclas…'); });
    }
    listen(document, 'click', function (event) {
        var target = (event || window.event).target || (event || window.event).srcElement, action;
        while (target && target !== document) { action = target.getAttribute && target.getAttribute('data-action'); if (action) { break; } target = target.parentNode; }
        if (action === 'fullscreen') { fullscreen(); } else if (action === 'favorites' || action === 'all') { favoriteOnly = action === 'favorites'; render(); }
    });
    listen(document, 'keydown', function (event) {
        event = event || window.event; var code = event.keyCode || event.which, action = actionFor(code), target = event.target || event.srcElement;
        if (page === 'diagnostics') { keyLines.unshift('keyCode=' + code + ' which=' + event.which + ' key=' + (event.key || '(sin nombre)')); keyLines = keyLines.slice(0, 12); text(byId('keys'), keyLines.join('\n')); }
        if (target && /^(TEXTAREA|INPUT|SELECT)$/.test(target.tagName)) { return; }
        if (!action) { return; } if (event.preventDefault) { event.preventDefault(); } event.returnValue = false;
        if (action === 'ok') { if (document.activeElement && document.activeElement.click) { document.activeElement.click(); } }
        else if (action === 'back') { if (page !== 'home') { window.location.href = 'index.html'; } else { favoriteOnly = false; render(); focusFirst(); } }
        else { move(action); }
    });
    if (storageNote) { status(storageNote); } focusFirst();
}());
