import { Request, Response, NextFunction } from "express";
import {
  DecodeResult,
  ExpirationStatus,
  Session,
} from "./session/session-interface";
import { decodeSession } from "./session/decode-session";
import { encodeSession } from "./session/encode-session";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;

export function checkExpirationStatus(token: Session): ExpirationStatus {
  const now = Date.now();

  if (token.expires > now) {
    return "active";
  }

  const threeHoursInMs = 3 * 60 * 60 * 1000;
  const threeHoursAfterExpiration = token.expires + threeHoursInMs;

  if (threeHoursAfterExpiration > now) {
    return "grace";
  }

  return "expired";
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const unauthorized = (message: string) =>
    res.status(401).json({
      ok: false,
      status: 401,
      message: message,
    });

  const requestHeader = "X-JWT-Token";
  const responseHeader = "X-Renewed-JWT-Token";
  const header = req.header(requestHeader);

  if (!header) {
    unauthorized(`Required ${requestHeader} header not found.`);
    return;
  }

  const decodedSession: DecodeResult = decodeSession(SECRET_KEY, header);

  if (
    decodedSession.type === "integrity-error" ||
    decodedSession.type === "invalid-token"
  ) {
    unauthorized(
      `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`
    );
    return;
  }

  const expiration: ExpirationStatus = checkExpirationStatus(
    decodedSession.session
  );

  if (expiration === "expired") {
    unauthorized(
      `Authorization token has expired. Please create a new authorization token.`
    );
    return;
  }

  let session: Session;

  if (expiration === "grace") {
    // Automatically renew the session and send it back with the res
    const { token, expires } = encodeSession(SECRET_KEY);
    session = {
      ...decodedSession.session,
      expires: expires,
    };

    res.setHeader(responseHeader, token);
  } else {
    session = decodedSession.session;
  }

  res.locals = {
    ...res.locals,
    session: session,
  };

  next();
}
