import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SESSION_ISSUER = "lumyn-academy";
const SESSION_AUDIENCE = "lumyn-academy-dashboard";
const SESSION_MAX_AGE = "7d";

export const ACADEMY_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type AcademySessionPayload = JWTPayload & {
  uid: string;
  email?: string;
  name?: string;
  tokenType: "academy_session";
};

function academySessionSecret() {
  const secret =
    process.env.ACADEMY_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.FIREBASE_PRIVATE_KEY;

  if (!secret) {
    throw new Error(
      "ACADEMY_SESSION_SECRET or NEXTAUTH_SECRET must be configured.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createAcademySessionToken(payload: {
  uid: string;
  email?: string;
  name?: string;
}) {
  return new SignJWT({
    uid: payload.uid,
    email: payload.email,
    name: payload.name,
    tokenType: "academy_session",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(payload.uid)
    .setExpirationTime(SESSION_MAX_AGE)
    .sign(academySessionSecret());
}

export async function verifyAcademySessionToken(
  token?: string | null,
): Promise<AcademySessionPayload> {
  if (!token) {
    throw new Error("Missing Academy session token.");
  }

  const { payload } = await jwtVerify(token, academySessionSecret(), {
    algorithms: ["HS256"],
    issuer: SESSION_ISSUER,
    audience: SESSION_AUDIENCE,
  });

  if (
    payload.tokenType !== "academy_session" ||
    typeof payload.uid !== "string" ||
    !payload.uid
  ) {
    throw new Error("Invalid Academy session token.");
  }

  return {
    ...payload,
    tokenType: "academy_session",
    uid: payload.uid,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
  };
}
