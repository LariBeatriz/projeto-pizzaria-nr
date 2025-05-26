
# 🍕 Pizzaria Web System - Fullstack CRUD com Autenticação JWT

Este projeto foi desenvolvido com o objetivo de criar um sistema Fullstack para gerenciar uma pizzaria de forma segura e eficiente. A aplicação é composta por:

✅ **Frontend**: Interface intuitiva e responsiva, desenvolvida com HTML, CSS e JavaScript.

✅ **Backend**: API REST em Node.js, responsável pela lógica de negócios e persistência de dados, com autenticação segura via JWT.

✅ **Autenticação**: Apenas usuários autenticados podem acessar as funcionalidades de gerenciamento.

✅ **Swagger**: Documentação interativa da API para facilitar o entendimento e os testes.
## 🏆 Funcionalidades Implementadas

- CRUD completo para as seguintes entidades:
  - **Clientes**: Nome, Telefone, Endereço, etc.
  - **Usuários**: Gerenciamento de contas e autenticação.
  - **Produtos**: Pizzas, Bebidas e Sobremesas com Nome, Descrição, Preço e Categoria.
  - **Pedidos**: Cliente, Itens do pedido (Produto e quantidade), Status, Valor Total e Data/Hora, etc.
- Autenticação JWT: segurança nas rotas sensíveis.
- Documentação da API via Swagger.
- Comunicação assíncrona com a API utilizando Fetch ou Axios.
## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- HTML5
- CSS3 (com possibilidade de uso de Bootstrap ou bibliotecas UI)
- JavaScript (Fetch/Axios)

### 🔧 Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- SQLite3 (banco de dados local)
- Swagger (Documentação da API)
## 🌐 Endpoints da Aplicação

### 🔗 URLs Principais
- Frontend: `http://localhost:4000`
- Backend: `http://localhost:3000`
- Login (Autenticação): `http://localhost:3000/auth/login`

⚠️ Para acessar as rotas protegidas, é necessário gerar um token via login.

### 🔐 Como Autenticar
1. Faça um POST para `/auth/login` com o username e password:
```json
{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

2. Receba o token JWT.

3. Inclua o token no Authorization Header das requisições protegidas:
```makefile
Authorization: Bearer <seu_token>
```
## 📖 Rotas da API REST

🧑‍💼 Usuários

- GET /usuarios → Listar todos os usuários

- POST /usuarios → Criar um novo usuário

- PUT /usuarios/:id → Atualizar dados de um usuário

- PATCH /usuarios/:id → Atualizar parcialmente dados de um usuário

- DELETE /usuarios/:id → Deletar um usuário

👥 Clientes

- GET /clientes → Listar todos os clientes

- POST /clientes → Cadastrar um novo cliente

- PUT /clientes/:id → Atualizar cliente

- PATCH /clientes/:id → Atualização parcial

- DELETE /clientes/:id → Deletar cliente

🍕 Produtos

- GET /produtos → Listar todos os produtos

- POST /produtos → Adicionar um produto

- PUT /produtos/:id → Atualizar produto

- PATCH /produtos/:id → Atualização parcial

- DELETE /produtos/:id → Deletar produto

📦 Pedidos

- GET /pedidos → Listar todos os pedidos

- POST /pedidos → Criar um pedido

- PUT /pedidos/:id → Atualizar pedido

- PATCH /pedidos/:id → Atualização parcial

- DELETE /pedidos/:id → Deletar pedido
## 📝 Como Executar o Projeto

### ⚙️ Requisitos:

- Node.js instalado

### 📦 Instalação das dependências:

#### **Frontend:**
```bash
cd frontend
npm install
```

#### **Backend:**
```bash
cd backend
npm install
```

### ▶️ Executando o projeto:

#### **Frontend:**
```bash
npm run dev
```

#### **Backend:**
```bash
npm run dev
```
## 📄 Documentação da API (Swagger)

Acesse a documentação completa da API e teste todos os endpoints diretamente através do Swagger.

👉 Disponível em: http://localhost:3000/api-docs

## 👥 Envolvidos

- [@Larissa Beatriz](https://github.com/LariBeatriz)
- [@Pedro Maia](https://github.com/pedrohmaiaoliv)
- [@Marcella Maria](https://github.com/marcella10109)
