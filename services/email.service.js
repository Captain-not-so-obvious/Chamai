const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const enviarEmailChamadoResolvido = async (destinatario, nomeSolicitante, tituloChamado) => {
  const sendSmtpEmail = {
    sender: { email: process.env.SENDER_EMAIL, name: 'Suporte TI' },
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

module.exports = { enviarEmailChamadoResolvido };