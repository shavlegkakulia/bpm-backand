import { JwtPayload } from "jsonwebtoken";
export interface AppJwtPayload extends JwtPayload {
  userId?: number;
}
