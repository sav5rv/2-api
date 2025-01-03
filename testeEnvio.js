require('dotenv').config();
const nodemailer = require('nodemailer');

const enviarEmailTeste = async () => {
  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.azurecomm.net',
        port: 587,
        secure: false, // false para TLS (STARTTLS)
        auth: {
          type: "OAuth2",
          user: "wellington_savioli@hotmail.com", // Seu e-mail do Hotmail
          pass: "ogxhuovkvzafavld", // Sua senha do Hotmail
        },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Seu e-mail do Yahoo
      to: 'destinatario@email.com', // Substitua pelo e-mail de teste
      subject: 'Teste de envio com Yahoo Mail',
      text: 'Este é um e-mail de teste enviado via Nodemailer e Yahoo Mail.',
      html: '<p>Este é um <b>e-mail de teste</b> enviado via Nodemailer e Yahoo Mail.</p>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
};

// Executar a função de teste
enviarEmailTeste();
