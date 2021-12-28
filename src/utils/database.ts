import { Sequelize } from "sequelize";
import DotEnv from "dotenv";

export interface IConfigParesd {
  parsed?: IConfigs;
}

export interface IConfigs {
  DB_HOST: string;
  DB_NAME: string;
  DB_SCHEMA: string;
  DB_USER: string;
  DB_PASS: string;
  APP_PORT: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRE: string;
  JWT_MAIL: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_SECURE: string;
  WEB_URL: string;
}

const Configs = DotEnv.config() as unknown as IConfigParesd;

const sequalize = new Sequelize(
  Configs.parsed.DB_NAME,
  Configs.parsed.DB_USER,
  Configs.parsed.DB_PASS,
  {
    dialect: "postgres",
    host: Configs.parsed.DB_HOST,
  }
);

export default sequalize;
