import { IUserModel } from "../models/userModel";

export interface UserCRUID {
    signup: (user: IUserModel) => Promise<any>;
    verify: (token: string) => Promise<any>;
    resetPassword:  (id: number, password: string) => Promise<any>;
    resetPasswordRequest:  (id: number, token: string) => Promise<any>;
}