# Chamaí

**Chamaí** é uma plataforma completa para gerenciamento de chamados, desenvolvida para facilitar a comunicação entre usuários, técnicos e administradores, permitindo o registro, acompanhamento e resolução de chamados de forma eficiente.

## ✅ Funcionalidades

- **Criação de Chamados**: Usuários podem abrir chamados informando título, descrição, prioridade e setor.
- **Cadastro de Técnicos**: Administradores podem cadastrar técnicos com login e senha exclusivos.
- **Atribuição de Técnicos**: Técnicos podem se atribuir aos chamados ou serem atribuídos manualmente.
- **Exibição do Técnico no Chamado**: O nome do técnico atribuído é exibido no card do chamado.
- **Alteração de Prioridade**: Técnicos podem alterar a prioridade de chamados em aberto.
- **Resolução de Chamados**: Técnicos podem resolver chamados; o sistema envia e-mail automático ao solicitante.
- **Histórico de Ações**: Toda movimentação relevante é registrada no histórico de cada chamado.
- **Autenticação e Autorização**: Sistema de login com JWT, com permissões distintas para usuários, técnicos e administradores.
- **Painel Técnico**: Técnicos visualizam apenas os chamados em aberto atribuídos a eles.
- **Ordenação por Data**: Chamados são listados do mais recente para o mais antigo.
- **Filtros e Busca**: Chamados podem ser filtrados por status, prioridade, setor e termos de busca.
- **Listagem Dinâmica de Setores**: O sistema detecta automaticamente os setores existentes nos chamados.

## 🛠 Tecnologias Utilizadas

- **Backend**: Node.js com Express.js
- **Frontend**: React.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Sequelize
- **Autenticação**: JWT (JSON Web Token)
- **Envio de E-mails**: Nodemailer com API da Brevo
- **Versionamento**: Git e GitHub

## ⚙️ Configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/Captain-not-so-obvious/Chamai.git
   cd Chamai
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto com o seguinte conteúdo:

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

## 🚀 Executando o Projeto

Inicie o servidor com:

```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

## 🧪 Testes com Postman

### Criar Chamado

```http
POST /chamados
```

#### Payload exemplo:

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

### Login

```http
POST /usuarios/login
```

### Cadastro de Técnico (Admin)

```http
POST /usuarios/tecnicos
Authorization: Bearer {token_do_admin}
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma **issue** para sugestões ou envie um **pull request** com melhorias ou novas funcionalidades.

## 📄 Licença

Este projeto é de uso **livre e aberto**. Sinta-se à vontade para modificar, adaptar e redistribuir conforme necessário.