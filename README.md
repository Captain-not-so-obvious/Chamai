# Chamaí

**Chamaí** é uma plataforma para gerenciamento de chamados, desenvolvida para facilitar a comunicação entre usuários e técnicos, registrando e acompanhando o progresso dos chamados.

## Funcionalidades

* **Criação de Chamados**: Usuários podem criar chamados com título, descrição e prioridade.
* **Atribuição de Técnicos**: Chamados podem ser atribuídos a técnicos para resolução.
* **Histórico de Chamados**: Cada alteração no status dos chamados é registrada no histórico.
* **Resolução de Chamados**: Técnicos podem resolver chamados, enviando notificações por e-mail para os solicitantes.

## Tecnologias Usadas

* **Backend**: Node.js com Express.js
* **Banco de Dados**: PostgreSQL
* **ORM**: Sequelize
* **Autenticação**: JWT (JSON Web Token)
* **Notificações**: Nodemailer (para envio de e-mails)
* **Controle de Versionamento**: Git, GitHub

## Estrutura do Projeto

```plaintext
ZapTI/
├── config/
│   └── db.js            # Configuração do banco de dados
├── controllers/
│   └── chamado.controller.js  # Lógica para criação e resolução de chamados
├── models/
│   └── chamado.model.js  # Modelo de dados do Chamado
│   └── historico.model.js # Modelo de dados do Histórico
│   └── usuario.model.js  # Modelo de dados do Usuário
├── routes/
│   └── chamado.routes.js  # Rotas para interação com os chamados
├── services/
│   └── email.service.js   # Funções para envio de e-mails
├── app.js                 # Arquivo principal para configuração do servidor
├── .env                   # Arquivo de variáveis de ambiente
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

## Configuração

1. Clone o repositório para sua máquina local:

   ```bash
   git clone https://github.com/Captain-not-so-obvious/zapti.git
   cd zapti
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

   ```env
   DB_HOST=localhost
   DB_NAME=zapti
   DB_USER=postgres
   DB_PASS=yourpassword
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

   Substitua as variáveis de acordo com sua configuração de banco de dados e credenciais de e-mail.

## Rodando o Projeto

1. **Inicie o servidor**:

   ```bash
   npm start
   ```

   O servidor estará rodando em `http://localhost:3000`.

2. **Sincronização com o banco de dados**:

   A sincronização com o banco de dados será feita automaticamente ao iniciar o servidor. Caso precise forçar a sincronização de modelos, use:

   ```bash
   npm run sync
   ```

## Testes

Você pode usar o **Postman** para testar as APIs da plataforma:

1. **POST** `/chamados`: Cria um novo chamado.
2. **PATCH** `/chamados/:id/resolver`: Resolve um chamado e envia um e-mail de notificação ao solicitante.

Exemplo de payload para criar um chamado:

```json
{
    "solicitanteNome": "João Silva",
    "solicitanteEmail": "joao.silva@example.com",
    "titulo": "Problema com login",
    "descricao": "Não consigo acessar minha conta.",
    "prioridade": "alta"
}
```

## Contribuindo

Sinta-se à vontade para abrir issues ou pull requests com melhorias, correções ou novas funcionalidades.

## Licença

Este projeto é de uso **livre**. Você pode modificar e distribuir o código de acordo com suas necessidades.

