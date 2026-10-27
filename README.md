# Sepal · protótipo v3 (PWA, dados fictícios)

Pasta publicável (Vercel, framework "Other", sem build). `README.md` e `screens/` ficam fora do deploy (`.vercelignore`).

## O que é cada arquivo
- `index.html` + `assets/app.js|css`: app (Preact): tab bar, PWA, instalação, notificações, WhatsApp, Sara/Davi, doações, Sepal ID (SSO), LGPD, 6 áreas, notas de desenvolvimento (`#/notas`).
- `site.html`: o `index.html` ORIGINAL do site (menu, hero, Quem somos, globo, rodapé), com as imagens, fontes e React locais.
- `area-missionaria.html`: a Central Sepal ORIGINAL (Área do Missionário), com a sidebar "Áreas Sepal" e a ponte com o app.
- `painel-vinculo.html`: o Painel Vínculo / Health Score ORIGINAL, com atalhos para a Central e para a Área 01 (PAI).
- `assets/vendor/`: embed.js (ponte), support.js, React 18.3.1, d3, topojson, sepal-globe.js. `assets/wp/`: imagens do site (cópia).
- `sw.js` (versão `V = 'sepal-v3-3'`; trocar a cada publicação), `manifest.webmanifest`, `offline.html`, `vercel.json` (`cleanUrls:false`, rewrites `/site`, `/area-missionaria`, `/painel-vinculo`).

## Navegação (v3.1, "uma coisa só")
- **Celular (< 900 px):** barra superior enxuta (logo, selo PROTÓTIPO, sino) + tab bar embaixo + menu "Menu ☰" do site. Não mudou.
- **Desktop (≥ 900 px):** UMA barra superior: logo · Início · menu original do site (Sobre, Missionários, Conteúdo, Envolva-se ▾ com 6 itens) · Doações · Atendimento · Perfil · (Instalar) · selo PROTÓTIPO · sino · botão **Área Missionária** (= Central Sepal). O header do site dentro do iframe fica oculto no desktop (`html.sp-embed header`, só ≥ 900 px) para não duplicar o menu.
- Só existe a v3: `arquivo-original-v1/` (site antigo) e `docs/` ficam no Git mas fora do deploy (`.vercelignore`).

## Rotas do app (hash)
`#/` (site) · `#/central` (Área do Missionário) · `#/central/areas` e `#/central/area/1..6` · `#/painel-vinculo` (Health Score) · `#/doacoes*` · `#/atendimento` · `#/perfil` · `#/entrar` · `#/notas` ...
Os endereços antigos `#/areas` e `#/area/N` continuam funcionando (redirecionam).

## Regras
- Onboarding: só na 1ª entrada no painel (Central, Áreas ou Health Score), por perfil, com "Não mostrar novamente" (`sepal2.tour.hide`) e "Rever apresentação" no Perfil e nas Áreas.
- Ponte: links internos das páginas originais viram navegação do app (postMessage); login da Central = Sepal ID.
- Reduced motion: `window.__RM` e CSS `prefers-reduced-motion` param carrossel, hero, globo e revelações.

## Fonte e testes
Fonte em `/workspace/sepal-prototipo-v3-src` (`node make.mjs` gera `assets/app.js|css`; `python3 orig/build_originals.py` regera as 3 páginas originais a partir de `/workspace/novositesepal-backup`). Testes Playwright em `tests/` (`full.py` e `v3.py`), servidor local: `python3 -m http.server 8780` na pasta publicável (e 8770 no repo do backup para comparar menus).
