const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const enviarEmailChamadoResolvido = async (destinatario, nomeSolicitante, tituloChamado) => {
  const sendSmtpEmail = {
    sender: { email: process.env.SENDER_EMAIL, name: 'Suporte TI - Não Responder' },
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
    console.log('E-mail enviado via API Brevo:', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar e-mail via API Brevo:', error);
    throw error;
  }
};

const enviarEmailRecuperacaoSenha = async (destinatario, token) => {
  const link = `http://localhost:5173/redefinir-senha?token=${token}`;

  const sendSmtpEmail = {
    sender: { email: process.env.SENDER_EMAIL, name: 'Suporte TI - Não Responder' },
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
      sender,
      to: [{ email: destinatarioEmail }],
      subject: `Chamado #${chamadoId} Aberto: ${chamadoTitulo}`,
      htmlContent: `
      <html>
        <body>
          <h3>Olá, ${destinatarioNome}</h3>
          <p>Seu chamado foi aberto com sucesso!</p>
          <p>Detalhes do Chamado:</p>
          <ul>
            <li><strong>ID:</strong> #${chamadoId}</li>
            <li><strong>Título:</strong> #${chamadoTitulo}</li>
            <li><strong>Status:</strong> Aberto</li>
          </ul>
          <p>Acompanhe o andamento pelo e-mail.</p>
          <p>Atenciosamente,<br/>Equipe de Suporte</p>
        </body>
      </html>
      `
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`E-mail de confirmação de chamado aberto enviado para e-mail cadastrado`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de abertura de chamado`, error);
  }
};

const enviarEmailChamadoAtualizado = async (destinatarioEmail, destinatarioNome, chamadoId, mensagemAtualizacao) => {
  try {
    const sendSmtpEmail = {
      sender,
      to: [{ email: destinatarioEmail }],
      subject: `Chamado #${chamadoId} Atualizado: ${mensagemAtualizacao}`,
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
    console.log(`E-mail de atualização do chamado enviado`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de atualização`)
  }
};

module.exports = { enviarEmailChamadoResolvido, enviarEmailRecuperacaoSenha, enviarEmailChamadoAberto, enviarEmailChamadoAtualizado };