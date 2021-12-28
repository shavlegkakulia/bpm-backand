import User, { IUserModel } from "../models/userModel";
import { UserCRUID } from "./../implementations/UserCRUID";

class UserServices implements UserCRUID {
  signup = async (user: IUserModel) => {
    return User.create({
      email: user.email,
      password: user.password,
      company: user.company,
      verifyToken: user.verifyToken,
    });
  };

  verify = async (token: string) => {
    return User.update(
      {
        verifyToken: null, status: 1
      },
      { where: { verifyToken: token } }
    );
  };

  resetPassword = async (id: number, password: string) => {
    return User.update(
      {
        password
      },
      { where: { id } }
    );
  };

  resetPasswordRequest = async (id: number, token: string) => {
    return User.update(
      {
        verifyToken: token
      },
      { where: { id } }
    );
  };
}

export default new UserServices();
