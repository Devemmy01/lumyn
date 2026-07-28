import {
  decodeProtectedHeader,
  importX509,
  jwtVerify,
  type JWTPayload,
} from "jose";

const FIREBASE_CERTIFICATES_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const DEFAULT_CERTIFICATE_TTL_MS = 60 * 60 * 1000;

type CertificateCache = {
  certificates: Record<string, string>;
  expiresAt: number;
};

export type VerifiedFirebaseToken = JWTPayload & {
  uid: string;
  email?: string;
  name?: string;
  email_verified?: boolean;
};

export class FirebaseCertificatesUnavailableError extends Error {
  constructor(message = "Firebase signing certificates are temporarily unavailable. Please try again in a moment.") {
    super(message);
    this.name = "FirebaseCertificatesUnavailableError";
  }
}

let certificateCache: CertificateCache | null = null;

function cacheLifetime(response: Response) {
  const cacheControl = response.headers.get("cache-control") ?? "";
  const match = cacheControl.match(/max-age=(\d+)/i);
  return match ? Number(match[1]) * 1000 : DEFAULT_CERTIFICATE_TTL_MS;
}

async function getFirebaseCertificates(forceRefresh = false) {
  if (!forceRefresh && certificateCache && certificateCache.expiresAt > Date.now()) {
    return certificateCache.certificates;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(FIREBASE_CERTIFICATES_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new FirebaseCertificatesUnavailableError();
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Firebase signing certificates returned ${response.status}.`);
  }

  const certificates = (await response.json()) as Record<string, string>;
  if (!certificates || typeof certificates !== "object") {
    throw new Error("Firebase signing certificates were invalid.");
  }

  certificateCache = {
    certificates,
    expiresAt: Date.now() + cacheLifetime(response),
  };

  return certificates;
}

export async function verifyAcademyToken(
  idToken?: string | null,
): Promise<VerifiedFirebaseToken> {
  if (!idToken) {
    throw new Error("Missing Firebase ID token.");
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not configured.");
  }

  const header = decodeProtectedHeader(idToken);
  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Firebase ID token has an invalid signing header.");
  }

  let certificates = await getFirebaseCertificates();
  let certificate = certificates[header.kid];
  if (!certificate) {
    certificates = await getFirebaseCertificates(true);
    certificate = certificates[header.kid];
    if (!certificate) {
      throw new Error("Firebase ID token uses an unknown signing key.");
    }
  }

  const publicKey = await importX509(certificate, "RS256");
  const { payload } = await jwtVerify(idToken, publicKey, {
    algorithms: ["RS256"],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
    clockTolerance: 5,
  });

  if (
    typeof payload.sub !== "string" ||
    payload.sub.length === 0 ||
    payload.sub.length > 128
  ) {
    throw new Error("Firebase ID token has an invalid subject.");
  }

  return {
    ...payload,
    uid: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
    email_verified:
      typeof payload.email_verified === "boolean"
        ? payload.email_verified
        : undefined,
  };
}
