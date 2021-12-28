import DotEnv from "dotenv";
import JWT from "jsonwebtoken";
import { IConfigParesd } from "../utils/database";
import { IUserModel } from "..//models/userModel";

const Configs = DotEnv.config() as unknown as IConfigParesd;

class TokenService {
  createToken = (data: IUserModel) => {
    const token = JWT.sign(
      { id: data.id, email: data.email },
      Configs.parsed.JWT_SECRET,
      { expiresIn: Configs.parsed.JWT_EXPIRE }
    );
    return token;
  };

  createRefreshToken = (data: IUserModel) => {
    const refresh = JWT.sign(
      { id: data.id },
      Configs.parsed.JWT_REFRESH_EXPIRE,
      {
        expiresIn: Configs.parsed.JWT_REFRESH_EXPIRE,
      }
    );
    return refresh;
  };

  encodeToken = (token: string) => {
    return JWT.verify(token, Configs.parsed.JWT_SECRET);
  }
}

export default new TokenService();
