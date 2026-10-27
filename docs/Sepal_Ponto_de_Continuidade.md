# Sepal – ponto de continuidade (27/10/2026, 13:40 BRT)

## Protótipo da plataforma (site novositesepal.vercel.app)
- v3 PUBLICADA no Vercel (time hannibalferreira-1260s-projects, projeto novositesepal), via Vercel CLI (login autorizado nesta máquina).
- Pastas na máquina do bot: /workspace/sepal-prototipo-v3 (publicável), /workspace/sepal-prototipo-v3-src (fonte + testes), backup do site original em /workspace/novositesepal-backup. v2 em /workspace/sepal-prototipo-v2.
- v3 inclui: menus originais, Central Sepal (Área do Missionário) com as 6 áreas, Health Score/Painel Vínculo, animações (carrossel Quem somos, globo, hero), onboarding só na 1ª entrada no painel com checkbox "Não mostrar novamente", SSO (Sepal ID simulado), LGPD nas inscrições (missionário, voluntário, doador), doações simuladas (Asaas/SafetyPay), Sara e Davi (provisórios).
- GitHub hannibalferreira-sepal/novositesepal ainda tem o código ANTIGO (backup). Para enviar a v3: conectar a conta GitHub hannibalferreira-sepal com permissão de escrita (a conectada hoje é hannibalferreira-inxu, sem acesso) ou dar git push com token.
- Falta: vídeos/rostos dos atendentes, vídeo do Cassiano, taxas Asaas/SafetyPay, lista oficial das 6 áreas, revisão jurídica da política de privacidade, specs para o time de dev (só após aprovação do protótipo).

## Planilhas
- Plano de Atividades por Módulo (53 macros, 234 filhas, ~2.994 h): https://docs.google.com/spreadsheets/d/17uIoa8vOBkPkTnjIlyQtltE6Vl4GHGalrEqTqo4WPrQ/edit (conta Sepal; não compartilhada com César/Cassiano, faltam e-mails Sepal).
- Planilha "Projetos" (aba erros): https://docs.google.com/spreadsheets/d/1kTJfrCN3tOByj_cSOOo9Q_rYDITDERjahiJdslMttpg/edit – deve ser renomeada/organizada como "Erros e atualizações".

## Em andamento
- Ler o grupo de WhatsApp "MEU SEPAL" (WhatsApp Web da máquina do bot, conta do Hannibal): prints de telas travadas e conversas de melhorias do Robô Sepal, para lançar na planilha "Erros e atualizações" (tipo, prioridade, projeto, data, ambiente, descrição, status, observação).
- Vercel conector "sepal": cartão de autorização pendente (não necessário, CLI funciona).

## Pendências antigas
- Recriar "Projeto Sepal" na conta Sepal (Sheets Sepal needsAuth); página no Google Sites; mentor capacidade 6 e Kiyoshi - SEPAL; JR compartilhar form do Conselho; OneDrive Sepal needsAuth.

## Atualização 27/10/2026 13:45 (America/Sao_Paulo)
- Grupo WhatsApp "MEU SEPAL" lido (prints do check-in PAI + 3 áudios + lista de 01/10).
- Planilha "Projetos" (id 1kTJfrCN3tOByj_cSOOo9Q_rYDITDERjahiJdslMttpg): aba "erros" renomeada para "erros e atualizações"; linhas 14-22 adicionadas (5 erros, 4 melhorias); aba "ideias" linhas 8-15 (lista de 01/10).
- Pendente: confirmar se a janela de disparos foi ampliada (linha 9 cita 6h-21h; pedido 7h-21h); GitHub sem permissão de escrita (conta conectada errada).

## 27/10/2026 · barra única no desktop (SW sepal-v3-3)
- Desktop (≥ 900 px): UMA barra superior (menu original do site + Doações/Atendimento/Perfil + Instalar + PROTÓTIPO + sino + botão Área Missionária = Central). O header do site no iframe fica oculto no desktop. Celular inalterado.
- `arquivo-original-v1/` (site antigo) deixou de ser publicado (`.vercelignore`); só existe a v3.
- Fonte: `src/p3b_app.tsx` (Topbar/SiteMenu), `new.css` (bloco "Desktop: UMA barra"), `orig/build_originals.py`; testes `tests/v3.py` (146) e `tests/full.py` (87), todos passando.
