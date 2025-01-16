
const serverURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://3.78.244.234:5001';

export const userLogin = async (email: string, password: string) => {
    let res: any = {success: true, error: "", data : {message: "", token: "", user: {}}};
    const response = await fetch(`${serverURL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    console.log(response , "fromAuthts  response");
    if(response.status !== 201) {
        res.success = false;
        res.error = "Invalid Credentials";
        return res;
    }
    res.data = await response.json();
    return res;
};

/**
 * Decodes a JWT without verifying its signature.
 * @param token - The JWT string to decode.
 * @returns The decoded payload as an object, or null if the token is invalid.
 */
function decodeJwt(token: string): Record<string, any> | null {
    try {
      const [, payload] = token.split('.'); // The payload is the second part of the JWT
      if (!payload) {
        throw new Error('Invalid JWT format');
      }
  
      // Decode the Base64 URL-encoded payload
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decodedPayload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }