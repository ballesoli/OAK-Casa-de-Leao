# Casa de Leão — Carvalhos de Justiça Church

Site oficial da **Casa de Leão**, família da Igreja Carvalhos de Justiça em Ribeirão Preto/SP.

> Uma igreja que trabalha com células. Vem como você é.

**Acesse:** https://ballesoli.github.io/OAK-Casa-de-Leao/

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
├── index.html          # Página única (todas as seções)
├── css/style.css       # Estilos (tema azul profundo com degradê, efeitos 3D)
├── js/three-scene.js   # Cena 3D do topo (Three.js: carvalho azul + partículas)
├── js/main.js          # Menu, reveals 3D, tilt, contagem regressiva, partículas
└── assets/             # Imagens, logo e favicon
```

## Como editar

- **Horários**: procure por `hero-schedule` e `schedule` no `index.html`, e a lista `weekly` no `js/main.js` (contagem regressiva).
- **Endereço**: seções `localizacao` no `index.html` (inclusive o `iframe` do mapa).
- **WhatsApp / YouTube**: links `wa.me/5516992126535` e `youtube.com/@fernanda_olegario` no `index.html`.

Site 100% estático (HTML/CSS/JS), hospedado no GitHub Pages — sem dependência de build.
