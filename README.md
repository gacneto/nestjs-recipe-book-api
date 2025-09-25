# Meu Caderno de Receitas API 🍳

![NestJS](https://img.shields.io/badge/NestJS-v10.x-red?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![Jest](https://img.shields.io/badge/Tests-Passing-brightgreen?style=for-the-badge&logo=jest)

API RESTful robusta para gerenciamento de um livro de receitas digital. Desenvolvida com NestJS, a API permite que usuários se cadastrem, autentiquem e gerenciem suas próprias receitas de forma segura.

---

## ✨ Funcionalidades

* **Autenticação de Usuários:** Sistema completo de `Sign Up` e `Sign In` com senhas hasheadas (`bcrypt`) e tokens de acesso JWT.
* **CRUD de Receitas:** Operações completas de Criar, Ler, Atualizar e Deletar receitas.
* **Segurança e Permissões:** Rotas protegidas onde cada usuário só pode gerenciar as suas próprias receitas.
* **Documentação Interativa:** Documentação da API gerada automaticamente com Swagger (OpenAPI), facilitando o consumo pelo frontend.
* **Ambiente Containerizado:** Banco de dados PostgreSQL rodando em um container Docker para facilitar a configuração do ambiente de desenvolvimento.
* **Validação de Dados:** Uso de DTOs (Data Transfer Objects) com `class-validator` para garantir a integridade dos dados que chegam na API.
* **Testes de Unidade:** Cobertura de testes para `services`, `controllers` e `strategies` usando Jest para garantir a confiabilidade do código.

---

## 🛠️ Tecnologias Utilizadas

| Ferramenta | Descrição |
| :--- | :--- |
| **NestJS** | Framework Node.js progressivo para construir aplicações backend eficientes e escaláveis. |
| **TypeScript** | Superset do JavaScript que adiciona tipagem estática ao código. |
| **PostgreSQL** | Sistema de gerenciamento de banco de dados relacional, robusto e de código aberto. |
| **TypeORM** | Framework ORM (Object-Relational Mapper) para interagir com o banco de dados. |
| **Docker** | Plataforma para desenvolver, implantar e executar aplicações em containers. |
| **Passport.js** | Middleware de autenticação para Node.js, usado aqui para a estratégia JWT. |
| **Swagger (OpenAPI)** | Ferramenta para projetar, construir, documentar e consumir APIs RESTful. |
| **Jest** | Framework de testes em JavaScript com foco em simplicidade. |

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 20.x ou superior)
* [Docker](https://www.docker.com/get-started) e Docker Compose
* [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Passos de Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/gacneto/recipe-book-api.git
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd recipe-book-api
    ```

3.  **Crie e configure o arquivo de variáveis de ambiente:**
    * Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
        ```bash
        cp .env.example .env
        ```
    * *Opcional: Altere as variáveis dentro do `.env` se necessário.*

4.  **Instale as dependências:**
    ```bash
    npm install
    ```

5.  **Inicie o container do banco de dados com Docker:**
    ```bash
    docker compose up -d
    ```

6.  **Execute a aplicação em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```

✅ A aplicação estará rodando em `http://localhost:3000`.

📖 A documentação da API estará disponível em `http://localhost:3000/api-docs`.

---

## 🧪 Rodando os Testes

Para executar os testes de unidade, utilize o comando:

```bash
npm run test
```

---

## Endpoints da API

Abaixo estão as rotas principais disponíveis na API.

| Método HTTP | Rota | Descrição | Autenticação? |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Registra um novo usuário. | ❌ Não |
| `POST` | `/auth/signin` | Autentica um usuário e retorna um token JWT. | ❌ Não |
| `POST` | `/recipes` | Cria uma nova receita para o usuário logado. | ✅ Sim |
| `GET` | `/recipes` | Lista todas as receitas do usuário logado. | ✅ Sim |
| `GET` | `/recipes/:id` | Busca uma receita específica do usuário logado. | ✅ Sim |
| `PATCH` | `/recipes/:id` | Atualiza uma receita do usuário logado. | ✅ Sim |
| `DELETE` | `/recipes/:id` | Deleta uma receita do usuário logado. | ✅ Sim |

---

## 👨‍💻 Autor

Feito por **Lucas Barcelar** ([@gacneto](https://github.com/gacneto))