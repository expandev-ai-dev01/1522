# Editor de Música Cifrada

Catálogo de músicas contendo a letra da música e as cifras dos acordes.

## Tecnologias

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router DOM 7.9.3
- TanStack Query 5.90.2
- Zustand 5.0.8
- React Hook Form 7.63.0
- Zod 4.1.11

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   └── router.tsx         # Configuração de rotas
├── pages/                 # Páginas da aplicação
│   ├── layouts/          # Layouts compartilhados
│   ├── Home/             # Página inicial
│   └── NotFound/         # Página 404
├── domain/               # Domínios de negócio
├── core/                 # Componentes e utilitários globais
│   ├── components/       # Componentes reutilizáveis
│   ├── lib/             # Configurações de bibliotecas
│   ├── types/           # Tipos globais
│   └── utils/           # Funções utilitárias
└── assets/              # Recursos estáticos
    └── styles/          # Estilos globais
```

## Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Funcionalidades

- Cadastro de músicas cifradas
- Visualização de músicas
- Edição de cifras
- Busca de músicas
- Transposição de tom
- Organização por categorias
- Exportação de músicas
- Compartilhamento de cifras
- Gerenciamento de usuários
- Criação de playlists