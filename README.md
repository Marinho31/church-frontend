# Church Management System - Frontend

Este é o frontend do sistema de gerenciamento de igreja, desenvolvido com React, TypeScript e Material-UI.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend rodando na porta 3000

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme necessário

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse o projeto:
- Frontend: http://localhost:5173
- API Backend: http://localhost:3000/api
- Swagger: http://localhost:3000/api-docs
- PgAdmin: http://localhost:8080

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── config/        # Configurações do projeto
  ├── contexts/      # Contextos do React
  ├── hooks/         # Hooks personalizados
  ├── layouts/       # Layouts da aplicação
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e integrações
  ├── types/         # Tipos e interfaces
  └── utils/         # Funções utilitárias
```

## Tecnologias Principais

- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- React Hook Form
- Yup

## Integração com Backend

O frontend se comunica com o backend através de uma API REST. Certifique-se que o backend está rodando na porta 3000 antes de iniciar o frontend.

## Autenticação

O sistema utiliza JWT para autenticação. O token é armazenado no localStorage e enviado automaticamente em todas as requisições através do interceptor do Axios.

## Desenvolvimento

Para contribuir com o projeto:

1. Crie uma branch para sua feature
2. Faça commit das suas alterações
3. Crie um Pull Request

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build de produção
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes
