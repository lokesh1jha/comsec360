import Mailjet from 'node-mailjet';
import logger from '../logger';

const MJ_APIKEY_PUPBLICKEY = process.env.MJ_APIKEY_PUBLIC ?? "40f382f912d6435e860a4275101c6f5c"
const MJ_APIKEY_PRIVATEKEY = process.env.MJ_APIKEY_PRIVATE ?? "7948275792b58f30ccb925dbe2b88c2f"

const mailjet = Mailjet.apiConnect(
  MJ_APIKEY_PUPBLICKEY,
  MJ_APIKEY_PRIVATEKEY,
);

export const sendEmail = async (emailbody: string, subject: string, email: string, fromEmail: string, textPart: string, attachment?: Uint8Array<ArrayBufferLike>, attachmentType?: string) => {
  try {
    const attachments = attachment ? [
      {
        ContentType: attachmentType ?? "application/pdf",
        Filename: attachmentType === "application/pdf" ? "attachment.pdf" : "attachment.txt",
        Base64Content: Buffer.from(attachment).toString('base64') // Convert Uint8Array to Base64
      }
    ] : [];

    const request = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: "ComSec Admin"
            },
            To: [
              {
                Email: email,
                Name: email.split('@')[0]
              }
            ],
            Attachments: attachments,
            Subject: subject,
            TextPart: textPart,
            HTMLPart: emailbody
          }
        ]
      });
    logger.info("Email sent successfully");
    return request;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
}
