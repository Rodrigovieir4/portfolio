# React Bits

Componentes copiados do [React Bits](https://reactbits.dev) pelo CLI do shadcn:

```bash
bunx --bun shadcn@latest add "https://reactbits.dev/r/<Nome>-TS-TW"
```

Ficam separados de propósito. São código de terceiro trazido para dentro do
repositório, então a pasta marca a fronteira: se um deles for editado, é bom
saber que a próxima atualização vinda do registro vai sobrescrever a mudança.

Ao chegar, o arquivo é renomeado para kebab-case, porque o lint do projeto
exige. O `StarBorder` precisa das animações `star-movement-*`, que ficam em
`src/app/globals.css`.

Todos dependem apenas de `react` e `motion/react`, nada de gsap ou ogl.
