import { encode, TAlgorithm } from "jwt-simple";
import { EncodeResult, Session } from "./session-interface";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

export function encodeSession(secretKey: string = SECRET_KEY): EncodeResult {
  const algorithm: TAlgorithm = "HS512";
  const fifteenMinutesInMs = 15 * 60 * 1000;
  const expires = Date.now() + fifteenMinutesInMs;
  const session: Session = {
    expires: expires,
  };

  return {
    token: encode(session, secretKey, algorithm),
    expires: expires,
  };
}
