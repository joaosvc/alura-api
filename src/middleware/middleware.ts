import { Request, Response, NextFunction } from "express";
import {
  DecodeResult,
  ExpirationStatus,
  Session,
} from "./session/session-interface";
import { decodeSession } from "./session/decode-session";
import { encodeSession } from "./session/encode-session";
import { config } from "dotenv";
import { HttpStatusCode } from "../controllers/protocols";
import { serverError } from "../controllers/helpers";

config();

export function checkExpirationStatus(token: Session): ExpirationStatus {
  const now = Date.now();

  if (token.expires > now) {
    return "active";
  }

  /** 3 hours * 60 minutes * 60 seconds * 1000 milliseconds */
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
  const SECRET_KEY = process.env.SECRET_KEY!;

  const unauthorized = (error: string, message: string) => {
    res.status(HttpStatusCode.UNAUTHORIZED).send({ error, message });
  };

  try {
    const requestHeader = "X-JWT-Token";
    const responseHeader = "X-Renewed-JWT-Token";
    const header = req.header(requestHeader);

    if (!header) {
      return unauthorized(
        "token-missing",
        `Required ${requestHeader} header not found.`
      );
    }

    const decodedSession: DecodeResult = decodeSession(SECRET_KEY, header);

    if (
      decodedSession.type === "integrity-error" ||
      decodedSession.type === "invalid-token"
    ) {
      return unauthorized(
        "integrity-error",
        `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`
      );
    }

    const expiration: ExpirationStatus = checkExpirationStatus(
      decodedSession.session
    );

    if (expiration === "expired") {
      return unauthorized(
        "token-expired",
        "Authorization token has expired. Please create a new authorization token."
      );
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
  } catch (error) {
    console.error(`Error in authMiddleware: ${error}`);
    res.status(HttpStatusCode.SERVER_ERROR).send(serverError().body);
  }
}
