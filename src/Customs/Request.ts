import { Request } from "express";

export interface AppRequest extends Request {
  isAuth?: boolean;
  userId?: number;
}
