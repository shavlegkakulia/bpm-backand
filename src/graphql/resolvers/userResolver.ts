import bcrypt from "bcrypt";
import validator from "validator";
import UserServices from "./../../services/UserServices";
import User, { IUserModel } from "../../models/userModel";
import AppError from "../../Customs/Errors/AppError";
import JWT from "jsonwebtoken";
import DotEnv from "dotenv";
import { IConfigParesd } from "../../utils/database";
import LocalesServices from "../../services/LocalesServices";
import MailService from "../../services/MailService";
import MailContent from "../../constants/MailContent";
import TokenService from "../../services/TokenService";
import AuthMidlweare, { IHeader } from "../../middlewares/auth";
import { IUserInput } from "../types/userTypes";

const Configs = DotEnv.config() as unknown as IConfigParesd;

export default {
  async signup(args: IUserInput) {
    const { email, password, company } = args.userInput;
    const errors: string[] = [];

    if (!validator.isEmail(email)) {
      errors.push("Email is invalid");
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 2 })
    ) {
      errors.push("Password too short");
    }

    if (validator.isEmpty(company)) {
      errors.push("Company required");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return {
        succes: false,
        errorMessage: ["User exists already!"],
        code: 200,
      };
    }

    const verification_token = JWT.sign({ email }, Configs.parsed.JWT_MAIL, {
      expiresIn: "100d",
    });

    const hashedPw = await bcrypt.hash(password, 12);

    return UserServices.signup({
      email,
      company,
      password: hashedPw,
      verifyToken: verification_token,
    })
      .then(async (user) => {
        const url = `${Configs.parsed.WEB_URL}verify/${verification_token}`;
        const mailContent = MailContent;
        mailContent.subject = "Verification";
        mailContent.to = email;
        mailContent.html = `<b><a href='${url}' target='_blank'>active<a></b>`;

        await MailService.Send(mailContent);

        return {
          data: user,
          succes: true,
          errorMessage: [],
          code: 200,
        };
      })
      .catch(() => {
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async login({ email, password }: { email: string; password: string }) {
    const errors: string[] = [];

    if (validator.isEmpty(email)) {
      errors.push("Email reuired");
    }

    if (validator.isEmpty(password)) {
      errors.push("Password required");
    }

    if (!validator.isLength(password, { min: 2 })) {
      errors.push("Password too short");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    const Model = (await User.findOne({
      raw: true,
      where: { email },
    })) as unknown as IUserModel;

    if (!Model) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    const isEqual = await bcrypt.compare(password, Model.password);

    if (!isEqual) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    const token = TokenService.createToken(Model);
    const refreshToken = TokenService.createRefreshToken(Model);

    return {
      data: {
        token,
        refreshToken,
      },
      succes: true,
      errorMessage: [] as string[],
      code: 200,
    };
  },

  async refresh({ refreshToken }: { refreshToken: string }) {
    if (!refreshToken) {
      const error = new AppError("forceLogout");
      error.code = 401;
      throw error;
    }

    return JWT.verify(
      refreshToken,
      Configs.parsed.JWT_REFRESH_EXPIRE,
      async (err, decodedToken) => {
        if (err) {
          const error = new AppError("forceLogout");
          error.code = 401;
          throw error;
        } else {
          const Model = (await User.findOne({
            raw: true,
            where: { id: decodedToken.id },
          })) as unknown as IUserModel;

          const token = TokenService.createToken(Model);
          const refresh_token = TokenService.createRefreshToken(Model);

          return {
            data: {
              token,
              refreshToken: refresh_token,
            },
            succes: true,
            errorMessage: [],
            code: 200,
          };
        }
      }
    );
  },

  async verify({ token }: { token: string }) {
    if (!token) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    const existingUser = await User.findOne({
      raw: true,
      where: { verifyToken: token },
    });

    if (!existingUser) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    return UserServices.verify(token)
      .then(() => {
        return {
          data: existingUser,
          succes: true,
          errorMessage: [],
          code: 200,
        };
      })
      .catch(() => {
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async resetPassword({
    token,
    email,
    password,
    repeatPassword,
  }: {
    token: string;
    email: string;
    password: string;
    repeatPassword: string;
  }) {
    if (validator.isEmpty(token)) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    const errors: string[] = [];

    if (!validator.isEmail(email)) {
      errors.push("Email is invalid");
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 2 })
    ) {
      errors.push("Password too short");
    }

    if (password !== repeatPassword) {
      errors.push("Confirm password!");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    const Model = (await User.findOne({
      raw: true,
      where: { email, verifyToken: token },
    })) as unknown as IUserModel;

    if (!Model) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    const hashedPw = await bcrypt.hash(password, 12);

    return UserServices.resetPassword(Model.id, hashedPw)
      .then(() => {
        return {
          succes: true,
          errorMessage: [],
          code: 200,
        };
      })
      .catch(() => {
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async resetPasswordRequest({ email }: { email: string }) {
    const errors: string[] = [];

    if (!validator.isEmail(email)) {
      errors.push("Email is invalid");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    const Model = (await User.findOne({
      raw: true,
      where: { email },
    })) as unknown as IUserModel;

    if (!Model) {
      return {
        succes: false,
        errorMessage: ["User not found."],
        code: 200,
      };
    }

    const reset_token = JWT.sign({ email }, Configs.parsed.JWT_MAIL, {
      expiresIn: "100d",
    });

    return UserServices.resetPasswordRequest(Model.id, reset_token)
      .then(async () => {
        const url = `${Configs.parsed.WEB_URL}resetPassword/${reset_token}`;
        const mailContent = MailContent;
        mailContent.subject = "Password Reset";
        mailContent.to = Model.email;
        mailContent.html = `<b><a href='${url}' target='_blank'>Reset<a></b>`;

        await MailService.Send(mailContent);

        return {
          succes: true,
          errorMessage: [],
          code: 200,
        };
      })
      .catch((err) => {
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async locales() {
    const all_locales = await LocalesServices.locales();

    if (!all_locales) {
      return {
        succes: false,
        errorMessage: ["Locales not found."],
        code: 200,
      };
    }

    return {
      locales: all_locales,
      succes: true,
      errorMessage: [] as string[],
      code: 200,
    };
  },

  async userInfo({}, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    const Model = (await User.findOne({
      raw: true,
      where: { id: user.id },
    })) as unknown as IUserModel;

    if (!Model) {
      const error = new AppError("User not found");
      error.code = 401;
      throw error;
    }

    return {
      data: {
        id: Model.id,
        email: Model.email,
        company: Model.company,
        status: Model.status,
      },
      succes: true,
      errorMessage: [] as string[],
      code: 200,
    };
  },
};
