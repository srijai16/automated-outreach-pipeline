import axios from "axios";

export async function sendEmail(
  toEmail: string,
  toName: string,
  title: string,
  company: string
) {

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL
      },

      to: [
        {
          email: toEmail,
          name: toName
        }
      ],

      subject: `${toName}, quick question`,

      htmlContent: `
      <html>
        <body>

          <p>Hi ${toName},</p>

          <p>
            I came across your profile and noticed
            you're a <strong>${title}</strong> at
            <strong>${company}</strong>.
          </p>

          <p>
            I've been building automated outreach
            and lead-generation workflows using
            Ocean, Prospeo, Brevo and modern web
            technologies.
          </p>

          <p>
            I would love to connect and learn more
            about your team and any opportunities
            where my skills could add value.
          </p>

          <p>
            Looking forward to hearing from you.
          </p>

          <br/>

          <p>
            Best regards,<br/>
            ${process.env.BREVO_SENDER_NAME}
          </p>

        </body>
      </html>
      `
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );

  return response.data;
}