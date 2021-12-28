import express from "express";
import JWT from "jsonwebtoken";
import DotEnv from "dotenv";
import { IConfigParesd } from "../utils/database";
import { AppJwtPayload } from "../interfaces/interfaces";

const Configs = DotEnv.config() as unknown as IConfigParesd;

interface IRequest {
  host: string;
  connection: string;
  pragma: string;
  accept: string;
  authorization: string;
  origin: string;
  referer: string;
}

export interface IHeader {
  request: IRequest;
}

interface IResponse {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

const AuthMidlweare = async (req: IHeader): Promise<IResponse> => {
  const authHeader = req.request.authorization;

  return new Promise((resolve, reject) => {
    if (!authHeader) {
      resolve({
        id: null,
        email: null,
        iat: null,
        exp: null,
      });
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;
    try {
      decodedToken = JWT.verify(
        token,
        Configs.parsed.JWT_SECRET
      ) as AppJwtPayload;
    } catch (err) {
      resolve({
        id: null,
        email: null,
        iat: null,
        exp: null,
      });
    }
    if (!decodedToken) {
      resolve({
        id: null,
        email: null,
        iat: null,
        exp: null,
      });
    }

    resolve({
      id: decodedToken.id,
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    });
  });
};

export default AuthMidlweare;
