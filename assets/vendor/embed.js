/* embed.js — ponte entre as páginas originais da Sepal (site, Central, Painel Vínculo) e o app v3.
   • Dentro do app (iframe): links internos viram navegação do app (postMessage); links externos abrem em nova aba.
   • Fora do app (página aberta direto): nada muda, os links funcionam como no site original.
   • Marca <html class="sp-embed"> e define window.__RM (prefers-reduced-motion). */
(function () {
  var emb = false;
  try { emb = window.parent !== window; } catch (e) { emb = true; }
  var mq = null;
  try { mq = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) { /* sem matchMedia */ }
  window.__RM = !!(mq && mq.matches);
  window.__EMB = emb;
  function mark() { if (emb && document.documentElement) document.documentElement.classList.add('sp-embed'); if (window.__RM && document.documentElement) document.documentElement.classList.add('sp-rm'); }
  mark(); document.addEventListener('DOMContentLoaded', mark);
  var MAP = { 'area-missionaria': 'central', 'painel-vinculo': 'painel-vinculo', 'index': '', 'site': '' };
  function go(to) { try { window.parent.postMessage({ sepal: 'nav', to: to }, '*'); } catch (e) { /* ignorado */ } }
  document.addEventListener('click', function (e) {
    var t = e.target; var a = t && t.closest ? t.closest('a[href]') : null; if (!a) return;
    var nav = a.getAttribute('data-sepal-nav');
    if (nav) { if (emb) { e.preventDefault(); go(nav); } return; }
    var h = a.getAttribute('href'); if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:|blob:)/i.test(h)) return;
    if (!emb) return;
    var u; try { u = new URL(h, location.href); } catch (er) { return; }
    if (u.origin === location.origin) {
      var name = u.pathname.replace(/^.*\//, '').replace(/\.html$/, '');
      if (name in MAP) { e.preventDefault(); go(MAP[name]); }
      return;
    }
    e.preventDefault(); window.open(u.href, '_blank', 'noopener');
  }, true);
  /* o app avisa quando o perfil do Sepal ID muda, etc. (reservado) */
  window.addEventListener('message', function (e) { if (e.data && e.data.sepal === 'ping') { try { e.source.postMessage({ sepal: 'pong' }, '*'); } catch (er) { /* ignorado */ } } });
})();
