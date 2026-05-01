import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET || "focosa-super-secret-key-change-in-prod";
const ALGORITHM = "HS256";
const ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24;

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createAccessToken(
  userId: number,
  email: string,
  role: string
): string {
  const payload: TokenPayload = {
    sub: userId.toString(),
    email,
    role,
  };

  return jwt.sign(payload, SECRET_KEY, {
    algorithm: ALGORITHM as any,
    expiresIn: `${ACCESS_TOKEN_EXPIRE_MINUTES}m`,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY, {
      algorithms: [ALGORITHM],
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}

export async function getCurrentUser(request: Request): Promise<TokenPayload | null> {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) return null;
  return verifyToken(token);
}

export function isAdmin(user: TokenPayload): boolean {
  return user.role === "admin";
}

export function isStudent(user: TokenPayload): boolean {
  return user.role === "student";
}
