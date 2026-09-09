# React Bits

Componentes copiados do [React Bits](https://reactbits.dev) pelo CLI do shadcn:

```bash
npx shadcn@latest add "https://reactbits.dev/r/<Nome>-TS-TW"
```

Ficam separados de propósito. São código de terceiro trazido para dentro do
repositório, então a pasta marca a fronteira: se um deles for editado, é bom
saber que a próxima atualização vinda do registro vai sobrescrever a mudança.

Já houve uma edição necessária. O `GlareHover` não compilava com
`noUncheckedIndexedAccess` ligado, e a leitura de dígito da cor hexadecimal
passou a usar desestruturação com valor padrão.

Todos dependem apenas de `react` e `motion/react`, nada de gsap ou ogl.
