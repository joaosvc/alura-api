import { decode, TAlgorithm } from "jwt-simple";
import { DecodeResult, Session } from "./session-interface";

export function decodeSession(
  secretKey: string,
  tokenString: string
): DecodeResult {
  const algorithm: TAlgorithm = "HS512";

  let result: Session;

  try {
    result = decode(tokenString, secretKey, false, algorithm);
  } catch (e) {
    const error = e as Error;

    // These error strings can be found here:
    // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
    if (
      error.message === "No token supplied" ||
      error.message === "Not enough or too many segments"
    ) {
      return {
        type: "invalid-token",
      };
    }

    if (
      error.message === "Signature verification failed" ||
      error.message === "Algorithm not supported"
    ) {
      return {
        type: "integrity-error",
      };
    }

    return {
      type: "invalid-token",
    };
  }

  return {
    type: "valid",
    session: result,
  };
}
