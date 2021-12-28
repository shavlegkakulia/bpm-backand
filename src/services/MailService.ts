import nodemailer from "nodemailer";
import DotEnv from "dotenv";
import { IConfigParesd } from "../utils/database";

const Configs = DotEnv.config() as unknown as IConfigParesd;

class MailService {
    async Send(content: any) {
        const transporter = nodemailer.createTransport({
            host: Configs.parsed.MAIL_HOST,
            port: parseInt(Configs.parsed.MAIL_PORT, 10),
            secure: Configs.parsed.MAIL_SECURE === 'true',
            auth: {
              user: Configs.parsed.MAIL_USER,
              pass: Configs.parsed.MAIL_PASS,
            },
          });

          try {
            return await transporter.sendMail(content);
          } catch (e) {
            return null;
          }
    }
}

export default new MailService();