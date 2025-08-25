const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// =========================================================================
// PADRONIZAÇÃO: Defina o remetente (sender) uma única vez aqui no topo.
// =========================================================================
const sender = { email: process.env.SENDER_EMAIL, name: 'Suporte Chamaí - Não Responder' };

const enviarEmailChamadoResolvido = async (destinatario, nomeSolicitante, tituloChamado) => {
  const sendSmtpEmail = {
    sender: sender, // Usa a variável global
    to: [{ email: destinatario }],
    subject: `Seu chamado foi resolvido: ${tituloChamado}`,
    htmlContent: `
      <p>Olá ${nomeSolicitante},</p>
      <p>O chamado <strong>${tituloChamado}</strong> foi marcado como resolvido.</p>
      <p>Se o problema persistir, você pode abrir um novo chamado a qualquer momento.</p>
      <br/>
      <p>Atenciosamente,<br/>Equipe de Suporte</p>
    `,
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('E-mail de chamado resolvido enviado via API Brevo:', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar e-mail de chamado resolvido via API Brevo:', error);
    throw error;
  }
};

const enviarEmailRecuperacaoSenha = async (destinatario, token) => {
  const link = `http://192.168.0.179:5173/redefinir-senha?token=${token}`;

  const sendSmtpEmail = {
    sender: sender,
    to: [{ email: destinatario }],
    subject: "Recuperação de Senha - Chamaí",
    htmlContent:`
    <p>Olá,</p>
    <p>Recebemos uma solicitação para redefinir sua senha.</p>
    <p>Por favor, clique no link abaixo para criar uma nova senha:</p>
    <p><a href="${link}">Redefinir minha senha</a></p>
    <p>Se você não solicitou isso, ignore este e-mail.</p>
    <br/>
    <p>Atenciosamente,<br/>Equipe de Suporte</p>
    `,
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('E-mail de Recuperação de senha enviado via Brevo:', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperação de senha via Brevo:', error);
    throw error;
  }
};

const enviarEmailChamadoAberto = async (destinatarioEmail, destinatarioNome, chamadoId, chamadoTitulo) => {
  try {
    const sendSmtpEmail = {
      sender: sender,
      to: [{ email: destinatarioEmail, name: destinatarioNome }],
      subject: `Chamado #${chamadoId} Aberto: ${chamadoTitulo}`,
      htmlContent: `
      <html>
        <body>
          <h3>Olá, ${destinatarioNome}</h3>
          <p>Seu chamado foi aberto com sucesso!</p>
          <p>Detalhes do Chamado:</p>
          <ul>
            <li><strong>ID:</strong> #${chamadoId}</li>
            <li><strong>Título:</strong> ${chamadoTitulo}</li>
            <li><strong>Status:</strong> Aberto</li>
          </ul>
          <p>Acompanhe o andamento pelo e-mail.</p>
          <p>Atenciosamente,<br/>Equipe de Suporte</p>
        </body>
      </html>
      `
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`E-mail de confirmação de chamado aberto enviado para ${destinatarioEmail}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de abertura de chamado`, error);
  }
};

const enviarEmailChamadoAtualizado = async (destinatarioEmail, destinatarioNome, chamadoId, mensagemAtualizacao) => {
  try {
    const sendSmtpEmail = {
      sender: sender,
      to: [{ email: destinatarioEmail, name: destinatarioNome }],
      subject: `Chamado #${chamadoId} Atualizado`,
      htmlContent: `
      <html>
        <body>
          <h3>Olá, ${destinatarioNome}</h3>
          <p>Seu Chamado #${chamadoId} foi atualizado:</p>
          <p><strong>${mensagemAtualizacao}</strong></p>
          <p>Atenciosamente, <br/>Equipe de Suporte</p>
        </body>
      </html>
      `,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`E-mail de atualização do chamado enviado para ${destinatarioEmail}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de atualização`, error)
  }
};

module.exports = { enviarEmailChamadoResolvido, enviarEmailRecuperacaoSenha, enviarEmailChamadoAberto, enviarEmailChamadoAtualizado };