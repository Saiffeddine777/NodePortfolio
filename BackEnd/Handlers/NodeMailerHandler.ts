import { SentMessageInfo } from "nodemailer/lib/json-transport";
import transporter from "../Config/NodeMailer";
import { SendEmailFunction } from "../Types/UtilityTypes";

const sendEmail: SendEmailFunction = async (email) => {
  try {
    const info: SentMessageInfo = await transporter.sendMail({
      to: email.to,
      from: process.env.EMAIL_APP_ADDRESS,
      subject: email.subject,
      text: email.text,
      ...(email.html ? { html: email.html } : {}),
      ...(email.attachments && email.attachments.length
        ? {
            attachments: email.attachments.map((att) => {
              return {
                filename: att.fileName,
                path: att.path,
              };
            }),
          }
        : {}),
    });
    return `Mail ${info.messageId} sent Succssfully`;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
