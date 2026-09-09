# Tarnishedle

Um jogo inspirado em Wordle para descobrir armas de *Elden Ring*. A cada rodada, uma arma é escolhida aleatoriamente e você deve encontrá-la usando as pistas reveladas em cada tentativa.

## Funcionalidades

- Busca por nome de arma com sugestões.
- Comparação de tipo, atributos, elementos, efeitos e origem.
- Pontuação baseada no número de tentativas.
- Nova rodada após encontrar a arma correta.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Como executar

Pré-requisitos: Node.js e pnpm instalados.

```bash
pnpm install
pnpm dev
```

Depois, abra o endereço exibido pelo Vite no navegador.

## Comandos

```bash
pnpm dev      # inicia o servidor de desenvolvimento
pnpm build    # verifica os tipos e gera a build de produção
pnpm lint     # executa o ESLint
pnpm preview  # serve a build de produção localmente
```

Os dados das armas ficam em `src/data/EldenRingWeaponsData.json` e são preparados em `src/data/weapons.ts`.


