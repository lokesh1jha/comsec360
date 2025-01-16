import jwt from 'jsonwebtoken';

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Generate a JWT token with user details.
 * @param payload - The payload containing user information.
 * @returns The signed JWT token.
 */
export const generateToken = (payload: { email: string; type: string; firstname: string; lastname: string, companyId?: number }, expiresIn?: string ) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn ?? JWT_EXPIRES_IN });
};

/**
 * Verify a JWT token and decode its payload.
 * @param token - The JWT token to verify.
 * @returns The decoded payload if the token is valid.
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string; type: string; firstname: string; lastname: string };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
