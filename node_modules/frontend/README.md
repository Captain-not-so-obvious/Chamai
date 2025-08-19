# 📞 Chamaí

Chamaí é uma plataforma completa para gerenciamento de chamados, desenvolvida para facilitar a comunicação entre usuários, técnicos e administradores, permitindo o registro, acompanhamento e resolução de chamados de forma eficiente.

---

## ✅ Funcionalidades

- **Criação de Chamados**: Usuários podem abrir chamados informando título, descrição, prioridade e setor. O sistema envia um e-mail de confirmação ao solicitante.
- **Cadastro de Técnicos e Administradores**: Administradores podem cadastrar novos técnicos e outros administradores com login e senha exclusivos.
- **Direcionamento de Chamados**: Administradores podem direcionar chamados para técnicos específicos.
- **Atribuição de Chamados**: Técnicos podem se atribuir a chamados que foram direcionados a eles, mudando o status para `em_atendimento`.
- **Exibição do Técnico no Chamado**: O nome do técnico atribuído é exibido no card do chamado.
- **Alteração de Prioridade**: Administradores e técnicos podem alterar a prioridade de chamados em aberto.
- **Resolução de Chamados**: Administradores e técnicos podem resolver chamados; o sistema envia e-mail automático ao solicitante.
- **Histórico de Ações**: Toda movimentação relevante é registrada no histórico de cada chamado.
- **Autenticação e Autorização (RBAC)**: Sistema de login com cookies HTTP-only, com permissões distintas para usuários, técnicos e administradores.
- **Painel Técnico**: Técnicos visualizam apenas os chamados direcionados a eles ou que já estão em atendimento.
- **Ordenação por Data**: Chamados são listados do mais recente para o mais antigo.
- **Filtros e Busca**: Administradores podem filtrar chamados por status, prioridade, setor e termos de busca.
- **Listagem Dinâmica de Setores**: O sistema detecta automaticamente os setores existentes nos chamados.

-----

## 📸 Demonstração

### Tela de Abertura de Chamado

![Abertura de Chamado](./docs/screenshots/abertura-chamado.gif)

### Painel Técnico

![Painel Técnico](./docs/screenshots/painel-tecnico.png)

-----


## 🛠 Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Nodemailer](https://img.shields.io/badge/Nodemailer-009C7C?style=for-the-badge&logo=nodemailer&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## ⚙️ Configuração

```bash
# Clone o repositório
git clone https://github.com/Captain-not-so-obvious/Chamai.git
cd Chamai

# Instale as dependências na raiz e no frontend
npm install
cd frontend
npm install
cd ..
```

Crie o arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_NAME=chamai
DB_USER=postgres
DB_PASS=yourpassword
DB_PORT=5432
JWT_SECRET=your_jwt_secret
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

---

## 🚀 Executando o Projeto

### Backend (raiz do projeto)

```bash
# Executa migrations
npx sequelize db:migrate

# Inicia o servidor Node.js
npm start
```

### Frontend (pasta `frontend`)

```bash
npm run dev
```

Aplicação disponível em: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Testes com Postman

A autenticação é feita via **cookies HTTP-only**. O token não é retornado no corpo da resposta e não pode ser acessado via JavaScript.

### Criar Chamado (Público)

```http
POST /chamados
```

**Payload exemplo**:

```json
{
  "solicitanteNome": "João Silva",
  "solicitanteEmail": "joao.silva@example.com",
  "titulo": "Erro no sistema",
  "descricao": "Tela de login não carrega.",
  "prioridade": "alta",
  "setor": "Financeiro"
}
```

### Login (Admin/Técnico)

```http
POST /auth/login
```

Após login, as requisições para rotas protegidas serão autenticadas automaticamente.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou envie um pull request com melhorias.

---

## 📄 Licença

Este projeto é de uso livre e aberto.
