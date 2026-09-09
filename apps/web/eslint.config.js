import { nextConfig } from '@portfolio/config-eslint/next';

const config = [
  ...nextConfig,
  {
    /*
     * Código de terceiro, trazido para dentro do repositório.
     *
     * src/components/ui vem do gerador do shadcn/ui e src/components/reactbits
     * vem do React Bits. Os dois são reescritos quando o componente é
     * atualizado pelo CLI, então corrigir estilo aqui é trabalho que se perde
     * na próxima atualização. As regras de tipagem estrita ficam desligadas
     * apenas nessas duas pastas, e valem integralmente no código do projeto.
     *
     * Erro de compilação continua valendo: o `tsc --noEmit` cobre estes
     * arquivos como cobre qualquer outro.
     */
    files: ['src/components/ui/**', 'src/components/reactbits/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      // O LogoLoop usa <img> quando o item traz src. O nosso uso passa node,
      // entao nenhuma imagem chega a ser renderizada por esse caminho.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
