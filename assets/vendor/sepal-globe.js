// <sepal-globe> — globo 3D com mini logos SEPAL nos locais dos missionários.
// Dados: window.SEPAL_LOCAIS = [{n, r, lat, lng, c}]. Hover: nome do local. Clique: evento 'sepal-local' (detail = nome).
(function () {
  if (customElements.get('sepal-globe')) return;
  const LOGO = 'assets/wp/wp-content/uploads/2019/09/logo_sepal_favicon_72.ico';
  const load = (src, test) => test() ? Promise.resolve() : new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  const wait = () => new Promise(res => { const t = () => window.SEPAL_LOCAIS ? res(window.SEPAL_LOCAIS) : setTimeout(t, 80); t(); });
  if (!document.getElementById('sepal-globe-css')) {
    const st = document.createElement('style'); st.id = 'sepal-globe-css';
    st.textContent = `sepal-globe .sg-pin{position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border:0;padding:0;background:none;cursor:pointer;display:grid;place-items:center}
sepal-globe .sg-badge{width:20px;height:20px;border-radius:6px;background:var(--c);border:1.5px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.5);display:grid;place-items:center;transition:transform .2s}
sepal-globe .sg-badge span{width:13px;height:13px;border-radius:50%;background:#fff url(${LOGO}) center/90% no-repeat}
sepal-globe .sg-pin:hover .sg-badge{transform:scale(1.35)}
sepal-globe .sg-pin.on .sg-badge{transform:scale(1.55);box-shadow:0 0 0 4px rgba(255,255,255,.25),0 3px 10px rgba(0,0,0,.6)}
sepal-globe .sg-name{position:absolute;bottom:calc(100% + 2px);left:50%;transform:translate(-50%,4px);background:#0e1828;color:#fff;font:600 12px 'Instrument Sans',sans-serif;padding:6px 10px;border-radius:999px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;box-shadow:0 4px 12px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.15)}
sepal-globe .sg-pin:hover .sg-name,sepal-globe .sg-pin:focus-visible .sg-name{opacity:1;transform:translate(-50%,0)}
sepal-globe .sg-pin:hover{z-index:50}
@keyframes sgCardIn{from{opacity:0;transform:var(--t) translateZ(-80px) translateY(14px)}to{opacity:1;transform:var(--t)}}
sepal-globe .sg-cards{position:absolute;inset:0;pointer-events:none;perspective:900px;z-index:60}
sepal-globe .sg-card{position:absolute;width:168px;display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:14px;background:rgba(14,24,40,.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.18);box-shadow:0 18px 30px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.2);color:#f3efe8;font:600 12px/1.2 'Instrument Sans',sans-serif;transform:var(--t);animation:sgCardIn .5s cubic-bezier(.2,.8,.2,1.1) both;pointer-events:auto;text-decoration:none}
sepal-globe .sg-card:hover{color:#fff;border-color:var(--c)}
sepal-globe .sg-av{width:34px;height:34px;border-radius:10px;flex:none;object-fit:cover;background:var(--c);color:#0a111d;display:grid;place-items:center;font:800 12px 'Archivo',sans-serif}
sepal-globe svg{display:block;width:100%;height:auto;cursor:grab;touch-action:pan-y}
sepal-globe svg:active{cursor:grabbing}`;
    document.head.appendChild(st);
  }
  class SepalGlobe extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      Object.assign(this.style, { display: 'block', position: 'relative', width: '100%', userSelect: 'none' });
      this.innerHTML = `<svg viewBox="0 0 600 600" style="overflow:hidden;border-radius:50%" aria-label="Globo com os locais dos missionários SEPAL">
<defs>
<radialGradient id="sgOcean" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#2c4b72"/><stop offset=".55" stop-color="#16263f"/><stop offset="1" stop-color="#0a111d"/></radialGradient>
<radialGradient id="sgShine" cx="32%" cy="26%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="sgShade" cx="38%" cy="32%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<radialGradient id="sgAtmo" cx="50%" cy="50%" r="50%"><stop offset=".86" stop-color="#ff8a4c" stop-opacity=".35"/><stop offset="1" stop-color="#ff8a4c" stop-opacity="0"/></radialGradient>
<filter id="sgLand"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".45"/></filter>
</defs>
<circle class="sg-atmo" cx="300" cy="300" r="298" fill="url(#sgAtmo)"/>
<circle class="sg-sph" cx="300" cy="300" r="270" fill="url(#sgOcean)"/>
<path class="sg-grid" fill="none" stroke="rgba(255,255,255,.08)" stroke-width=".8"/>
<path class="sg-land" fill="#e6ebf0" stroke="#fff" stroke-width=".6" filter="url(#sgLand)"/>
<circle class="sg-sph" cx="300" cy="300" r="270" fill="url(#sgShade)" pointer-events="none"/>
<circle class="sg-sph" cx="300" cy="300" r="270" fill="url(#sgShine)" pointer-events="none"/>
</svg><div class="sg-pins" style="position:absolute;inset:0;pointer-events:none;border-radius:50%"></div><div class="sg-cards"></div>`;
      this.svg = this.querySelector('svg'); this.pinsBox = this.querySelector('.sg-pins');
      this.rot = [45, 5]; this.k = 270; this.addEventListener('pointerdown', e => { if (e.target.closest('svg')) this.showCards(null); }); this.cur = null; this.hover = false;
      this.setup().catch(e => console.error('sepal-globe', e));
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); }
    async setup() {
      await load('assets/vendor/d3.min.js', () => window.d3);
      await load('assets/vendor/topojson-client.min.js', () => window.topojson);
      const [world, locs] = await Promise.all([fetch('assets/vendor/land-110m.json').then(r => r.json()), wait()]);
      const d3 = window.d3;
      this.locs = locs;
      this.land = topojson.feature(world, world.objects.land);
      this.grat = d3.geoGraticule10();
      this.proj = d3.geoOrthographic().scale(270).translate([300, 300]).clipAngle(90);
      this.path = d3.geoPath(this.proj);
      this.gridEl = this.querySelector('.sg-grid'); this.landEl = this.querySelector('.sg-land');
      this.pins = locs.map(l => {
        const b = document.createElement('button'); b.className = 'sg-pin'; b.type = 'button';
        b.style.setProperty('--c', l.c); b.style.pointerEvents = 'auto'; b.setAttribute('aria-label', l.n);
        b.innerHTML = `<span class="sg-badge"><span></span></span><span class="sg-name">${l.n}</span>`;
        b.addEventListener('mouseenter', () => this.hover = true);
        b.addEventListener('mouseleave', () => this.hover = false);
        b.addEventListener('click', () => this.select(l.n, true));
        this.pinsBox.appendChild(b); return b;
      });
      let drag = null;
      this.svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, r: [...this.rot] }; this.svg.setPointerCapture(e.pointerId); });
      this.svg.addEventListener('pointermove', e => {
        if (!drag) return; const k = 160 / this.svg.clientWidth;
        this.rot = [drag.r[0] + (e.clientX - drag.x) * k, Math.max(-60, Math.min(60, drag.r[1] - (e.clientY - drag.y) * k))];
      });
      const end = () => { drag = null; }; this.svg.addEventListener('pointerup', end); this.svg.addEventListener('pointercancel', end);
      const tick = () => {
        if (!drag && !this.anim && !this.hover && this.cur == null) this.rot[0] += (window.__RM ? 0 : 0.12);
        this.render(); this.raf = requestAnimationFrame(tick);
      };
      tick();
    }
    render() {
      const d3 = window.d3;
      this.proj.rotate(this.rot).scale(this.k);
      this.querySelectorAll('.sg-sph').forEach(c => c.setAttribute('r', this.k)); this.querySelector('.sg-atmo').setAttribute('r', this.k * 1.1);
      this.landEl.setAttribute('stroke-width', (0.6 * this.k / 270).toFixed(2));
      this.gridEl.setAttribute('d', this.path(this.grat));
      this.landEl.setAttribute('d', this.path(this.land));
      const c = [-this.rot[0], -this.rot[1]];
      this.locs.forEach((l, i) => {
        const p = this.proj([l.lng, l.lat]); const el = this.pins[i];
        const vis = d3.geoDistance([l.lng, l.lat], c) < Math.PI / 2 - 0.08 && Math.hypot(p[0] - 300, p[1] - 300) < 284;
        el.style.display = vis ? '' : 'none';
        el.style.left = (p[0] / 6) + '%'; el.style.top = (p[1] / 6) + '%';
        el.style.zIndex = el.classList.contains('on') ? 40 : Math.round(p[1] / 20);
      });
    }
    select(name, spin = true) {
      if (!this.locs) return;
      const i = this.locs.findIndex(l => l.n === name); if (i < 0) return;
      this.cur = i;
      this.pins.forEach((p, k) => p.classList.toggle('on', k === i));
      this.dispatchEvent(new CustomEvent('sepal-local', { detail: name, bubbles: true }));
      if (!spin) return;
      const l = this.locs[i], from = [...this.rot], to = [-l.lng, -l.lat], k0 = this.k, k1 = 640;
      const dl = ((to[0] - from[0]) % 360 + 540) % 360 - 180, t0 = performance.now();
      cancelAnimationFrame(this.animRaf); this.anim = true;
      const step = t => {
        const u = Math.min(1, (t - t0) / 800), e = 1 - Math.pow(1 - u, 3);
        this.rot = [from[0] + dl * e, from[1] + (to[1] - from[1]) * e]; this.k = k0 + (k1 - k0) * e;
        if (u < 1) this.animRaf = requestAnimationFrame(step); else this.anim = false;
      };
      this.animRaf = requestAnimationFrame(step);
    }
    showCards(items, color) {
      const box = this.querySelector('.sg-cards'); box.innerHTML = '';
      if (!items || !items.length) return;
      const W = this.clientWidth, cw = 168, ch = 58, gap = 10, max = 8;
      const shown = items.slice(0, max), extra = items.length - shown.length;
      const list = extra > 0 ? [...shown, { n: '+' + extra + ' missionários', more: true }] : shown;
      const perSide = Math.ceil(list.length / 2), cx = W / 2, cy = W / 2;
      const narrow = W < 2 * cw + 60;
      list.forEach((m, i) => {
        let x, y, side;
        if (narrow) { side = 0; x = cx - cw / 2; y = cy + 30 + i * (ch + gap) - (list.length * (ch + gap)) / 2; }
        else { side = i % 2 ? 1 : -1; const row = Math.floor(i / 2), rows = perSide; x = side < 0 ? cx - cw - 26 : cx + 26; y = cy - (rows * (ch + gap)) / 2 + row * (ch + gap); }
        y = Math.max(4, Math.min(W - ch - 4, y));
        const a = document.createElement(m.more || !m.href ? 'div' : 'a');
        if (a.tagName === 'A') { a.href = m.href; a.target = '_blank'; a.rel = 'noopener'; }
        a.className = 'sg-card'; a.style.left = x + 'px'; a.style.top = y + 'px';
        a.style.setProperty('--c', color || '#ff6a2b');
        a.style.setProperty('--t', `rotateX(14deg) rotateY(${side * -16}deg) translateZ(30px)`);
        a.style.animationDelay = (i * 0.05) + 's';
        const ini = m.ini || (m.n || '').split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('');
        const av = m.img ? `<img class="sg-av" src="${m.img}" alt="">` : `<span class="sg-av">${m.lock ? '🔒' : m.more ? '+' : ini}</span>`;
        a.innerHTML = av + `<span>${m.n}</span>`;
        box.appendChild(a);
      });
    }
    clear() {
      this.showCards(null);
      const k0 = this.k, t0 = performance.now(); cancelAnimationFrame(this.animRaf); this.anim = true;
      const step = t => { const u = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - u, 3); this.k = k0 + (270 - k0) * e; if (u < 1) this.animRaf = requestAnimationFrame(step); else this.anim = false; };
      this.animRaf = requestAnimationFrame(step);
      this.cur = null; this.pins && this.pins.forEach(p => p.classList.remove('on'));
      this.dispatchEvent(new CustomEvent('sepal-local', { detail: null, bubbles: true }));
    }
  }
  customElements.define('sepal-globe', SepalGlobe);
})();
