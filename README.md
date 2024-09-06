# 📝 CRUD de Alunos

Este é um sistema completo de CRUD de alunos, dividido em back-end e front-end. O projeto utiliza Node.js, Express, MySQL, React, Vite e Tailwind CSS. A aplicação permite cadastrar, editar, deletar e listar alunos. 

## 🚀 Tecnologias Utilizadas

- **Back-end:** Node.js, Express, MySQL
- **Front-end:** React, Vite, Tailwind CSS

## ⚙️ Funcionalidades

- **Cadastrar Alunos:** Adiciona novos alunos ao sistema.
- **Editar Alunos:** Modifica os dados de um aluno já existente.
- **Deletar Alunos:** Remove um aluno da base de dados.
- **Listar Alunos:** Exibe a lista de alunos cadastrados.

## 🛠️ Como Rodar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

1. **Instale as dependências:**
   Em ambos diretórios `BACK-END` e `FRONT-END`:
   ```bash
   npm install
   ```

2. **Crie o banco de dados:**

   Utilize o arquivo `DB.sql` para criar as tabelas no MySQL.

3. **Configure as variáveis de ambiente:**

   Renomeie os arquivos `.env.exemple` para `.env` tanto no diretório `BACK-END` quanto no `FRONT-END` e configure as credenciais de acordo com seu ambiente.

4. **Execute o projeto**
   Em ambos diretórios `BACK-END` e `FRONT-END`:
```bash
   npm run dev
   ```

## 🌐 Endpoints da API

- `GET /alunos`: Lista todos os alunos.
- `GET /alunos/:id`: Lista um aluno conforme o id.
- `POST /alunos`: Cadastra um novo aluno.
- `PUT /alunos/:id`: Edita os dados de um aluno existente.
- `DELETE /alunos/:id`: Remove um aluno do sistema.
