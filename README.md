# Casa de Leão — Carvalhos de Justiça OAK Church

Site oficial da **Casa de Leão**, família da Igreja Carvalhos de Justiça OAK Church em Ribeirão Preto/SP.

> Uma igreja que trabalha com células. Vem como você é.

**Acesse:** https://ballesoli.github.io/OAK-Casa-de-Leao/

Otimizado para **SEO**, **AEO** (mecanismos de resposta) e **GEO** (motores generativos de IA).

## Horários

| Quando | Horário | Encontro |
| --- | --- | --- |
| Domingo | 18h | Culto |
| Quarta | 12h | Reunião de Oração (não é culto) |
| Quinta | 20h | Culto |
| Último domingo do mês | 9h | Culto da Manhã |

**Endereço:** R. João Bim, 2265 — Ribeirão Preto • SP
**WhatsApp:** (16) 99212-6535
**YouTube:** [@fernanda_olegario](https://www.youtube.com/@fernanda_olegario/streams)

## Estrutura

```
├── index.html          # Página única (todas as seções + FAQ + JSON-LD)
├── css/style.css       # Estilos (tema azul profundo com degradê, efeitos 3D, acordeão FAQ)
├── js/three-scene.js   # Cena 3D do topo (Three.js: carvalho azul + partículas)
├── js/main.js          # Menu, reveals 3D, tilt, contagem regressiva, slider das células
├── robots.txt          # Permissões para buscadores e crawlers de IA (GEO)
├── sitemap.xml         # Mapa do site para o Google
├── llms.txt            # Resumo estruturado para motores generativos de IA (GEO)
└── assets/
    ├── logo-leao.jpg   # Logotipo oficial da Casa de Leão (leão + igreja, fundo azul do site)
    ├── celulas/        # Fotos reais das células (slider — celula-01 … celula-10)
    └── ...             # Demais imagens, logo da rede e favicon
```

## Como editar

- **Horários**: procure por `hero-schedule` e `schedule` no `index.html`, e a lista `weekly` no `js/main.js` (contagem regressiva). Ao mudar horários, atualize também o FAQ (`#faq`), o bloco JSON-LD (`OpeningHoursSpecification` / `FAQPage`) e o `llms.txt`.
- **Fotos das células**: substitua ou adicione arquivos em `assets/celulas/` e atualize o bloco `celSlider` no `index.html` (as fotos são exibidas sem cortes, com rostos e cenário originais).
- **Logo da Casa de Leão**: arquivo `assets/logo-leao.jpg` (seção Sobre) — fundo azul do site em degradê navy, arte branca preservada.
- **Endereço**: seções `localizacao` no `index.html` (inclusive o `iframe` do mapa — exibido nas cores originais do Google Maps).
- **WhatsApp / YouTube**: links `wa.me/5516992126535` e `youtube.com/@fernanda_olegario` no `index.html`.

## SEO / AEO / GEO — o que já está implementado

- **SEO**: title e meta description otimizados, canonical, robots, Open Graph completo, Twitter Card, tags de geolocalização, `sitemap.xml`, `robots.txt`, HTML semântico (`main`, `time`, `address`), `width`/`height` nas imagens (evita CLS), preload do hero (LCP), textos alternativos descritivos.
- **AEO**: seção de Perguntas Frequentes com respostas diretas na primeira frase + schema `FAQPage` + `speakable` (respostas prontas para assistentes de voz e featured snippets).
- **GEO**: schema JSON-LD completo (`Church` com endereço, CEP, coordenadas, telefone, horários e matriz), `llms.txt` com os fatos da igreja em formato estruturado, `robots.txt` liberando crawlers de IA (GPTBot, ClaudeBot, PerplexityBot etc.), entidade nomeada de forma consistente em todo o site.

Para acompanhar o desempenho no Google, cadastre o site no [Google Search Console](https://search.google.com/search-console) e envie o sitemap `https://ballesoli.github.io/OAK-Casa-de-Leao/sitemap.xml`.

Site 100% estático (HTML/CSS/JS), hospedado no GitHub Pages — sem dependência de build.
