import Mailgun from "mailgun.js";
import formData from "form-data";

export default defineEventHandler(async (event) => {
  const param = await readMultipartFormData(event);
  const data: any = {
    files: [],
  };

  param?.forEach((p: any) => {
    if (p.name !== "files") {
      data[p.name] = p.data.toString();
    } else {
      data.files.push(p);
    }
  });

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAIL_API_KEY,
  });

  const msg = `
Position: ${data["position"]}
Name: ${data["name"]}
Email: ${data["email"]}

PLEASE PROVIDE AN EXAMPLE OF OSINT AND HOW YOU’VE UTILIZED IT IN A PREVIOUS PROJECT OR INVESTIGATION:
${data["osint"]}

PLEASE DESCRIBE 3 AREAS WITHIN THE INVESTIGATIONS INDUSTRY THAT YOU FIND PARTICULARLY INTERESTING
${data["obs"]}
  `;

  const mailData = {
    from: data["email"],
    to: process.env.MAIL_TO,
    subject: "[Vantage Website] Join Us",
    text: msg,
    attachment: [data.files[0].data, data.files[1].data],
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
