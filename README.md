# Lesson View API

API desenvolvida em NestJS para gerenciamento de alunos, turmas, responsáveis e horários de aula.

## Sumário

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Testes](#testes)
- [Autenticação via Token](#autenticação-via-token)
- [Comandos úteis NestJS](#comandos-úteis-nestjs)
- [Estrutura dos Módulos](#estrutura-dos-módulos)
- [Licença](#licença)

---

## Descrição

Projeto para controle de alunos, turmas, responsáveis e horários, utilizando NestJS, TypeORM e PostgreSQL.

## Funcionalidades

- CRUD de Alunos (`Student`)
- CRUD de Turmas (`Class`)
- CRUD de Responsáveis (`Responsible`)
- CRUD de Horários (`WeekTime`)
- Vinculação de alunos a turmas (`StudentClass`)
- Relacionamento entre responsáveis e alunos

## Instalação

```bash
yarn install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=lesson
DB_PASSWORD=lesson
DB_DATABASE=lesson_view
TYPEORM_CONNECTION=postgres
JWT_SECRET=seu_token_secreto
```

## Execução

```bash
# Desenvolvimento
yarn run start

# Modo watch (hot reload)
yarn run start:dev

# Produção
yarn run start:prod
```

## Testes

```bash
# Testes unitários
yarn run test

# Testes e2e
yarn run test:e2e

# Cobertura de testes
yarn run test:cov
```

## Autenticação via Token

A API utiliza autenticação JWT. Para acessar rotas protegidas:

1. Faça login e obtenha o token JWT.
2. Envie o token no header das requisições:

```
Authorization: Bearer <seu_token>
```

## Comandos úteis NestJS

### Gerar módulo

```bash
nest generate module nome-do-modulo
# ou
nest g mo nome-do-modulo
```

### Gerar controller

```bash
nest generate controller nome
# ou
nest g co nome
```

### Gerar service

```bash
nest generate service nome
# ou
nest g s nome
```

### Gerar resource completo (CRUD)

```bash
nest g resource nome --no-spec
```

## Estrutura dos Módulos

- `students`: Gerenciamento de alunos
- `class`: Gerenciamento de turmas
- `responsible`: Gerenciamento de responsáveis
- `week-time`: Gerenciamento de horários
- `student-class`: Vinculação aluno-turma

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

MIT [MIT licensed](LICENSE).
