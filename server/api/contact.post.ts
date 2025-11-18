import Mailgun from "mailgun.js";
import formData from "form-data";

export default defineEventHandler(async (event) => {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAIL_API_KEY,
  });

  const data = await readBody(event);

  const msg = `
  Name: ${data["name"]}
  Email: ${data["email"]}
  Company: ${data["company"]}
  
  Message:
  ${data["message"]}
  `;

  const mailData = {
    from: data["email"],
    to: process.env.MAIL_TO,
    subject: "[Vantage Website] Contact",
    text: msg,
  };

  const response = await client.messages.create(
    process.env.MAIL_API_DOMAIN,
    mailData
  );

  if (response.status !== 200) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  return {
    success: true,
  };
});
