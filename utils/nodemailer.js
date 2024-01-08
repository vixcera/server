import mailer from 'nodemailer';

const nodemailer = async (email, username, url, response) => {
  const tranporter = mailer.createTransport({
    port: 465,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth:
        {
          user: `${process.env.user}`,
          pass: `${process.env.pass}`,
        },
  });
  const options = {
    from: 'vixcera <no-reply@gmail.com>',
    to: email,
    subject: 'Verify Account',
    html:
        `<div style="width: 400px; height: max-content; background-color: #1f1d25; padding: 40px; box-sizing: border-box; font-family: sans-serif;">
        <h1 style="font-family : serif; color: #FAF0E6; text-align: center; margin: 30px 0;">Vixcera</h1>
        <h3 style="text-align: center; color: #EBE76C; margin-top: 30px;">Hi ${username}!</h3>
        <h3 style="text-align: center; color: #EBE76C;">Please verify yourself.</h3>
        <div style="width: max-content; margin: 30px auto;"><a style="padding: 15px 50px; background-color: #EBE76C; border-radius: 10px; text-decoration: none; color: #0b0b0e;" href="${url}" target="_blank">Verify account</a></div>
        <p style="text-align: center; margin-top: 50px; color: #FAF0E6; font-size: 0.75rem;">thank you very much for joining Vixcera, we are ready to help you with your work and always update anything what you need.</p>
        <p style="text-align: center; margin-top: 50px; color: #FAF0E6; font-size: 0.65rem;">© Vixcera. Xera Platforms, Ind., 16165 West Java, CA 95685</p>
        </div>`,
  };
  tranporter.sendMail(options, (error) => {
    if (error) return console.log(error.message);
    return response.status(200).json('email verification was sent successfully, please check your email.');
  });
};

export default nodemailer;
