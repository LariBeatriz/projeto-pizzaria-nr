
# Pizzaria Fullstack Nova Roma

O projeto consiste em criar um sistema com funcionalidades CRUD (Criar, Ler, Atualizar, Deletar) para entidades específicas de cada tema, utilizando autenticação via JWT. A aplicação será desenvolvida com HTML, CSS e JavaScript no frontend e uma API REST em Node.js no backend, utilizando módulos/bibliotecas/pacotes necessários.
## Envolvidos

- [@Larissa Beatriz](https://github.com/LariBeatriz)
- [@Pedro Maia](https://github.com/pedrohmaiaoliv)
- [@Marcella Maria](https://github.com/marcella10109)


## Deploy

Para fazer o deploy desse projeto rode:

```bash
  npm install
```
## Documentação da API

#### Retorna todos os itens

```http
  GET /api/items
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API |

#### Retorna um item

```http
  GET /api/items/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |

#### add(num1, num2)

Recebe dois números e retorna a sua soma.

