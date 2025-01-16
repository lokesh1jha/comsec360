import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getUsersByEmail } from "../db/user";
import logger from "../utils/logger";
import { getShareholderByEmail, getDirectorByEmail } from "../db/user";

export const validateRequest =
  (schema: z.ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          message: "Validation error",
          errors: result.error.errors,
        });
        return; // Prevent further execution
      }

      // Attach validated data to the request body
      req.body = result.data;

      // Call next middleware or route handler
      next();
    };


export const validationJWT = (allowedUserTypes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let decodedToken;
    try {
      decodedToken = decodeJWT(token); // Ensure decodeJWT is an async-compatible function if necessary
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    console.log("decodedToken: ", decodedToken);

    try {
      const user = await getUsersByEmail(decodedToken.email);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Add type to request body
      req.body.loggedInUser = user;
      const isAllowed = allowedUserTypes.includes(user.type);
      if (!isAllowed) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      next();
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};


function decodeJWT(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


export const validateGuestUserType = (allowedUserTypes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let decodedToken;
    try {
      decodedToken = decodeJWT(token); // Ensure decodeJWT is an async-compatible function if necessary
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    console.log("decodedToken: ", decodedToken);
    const { email, type, companyId } = decodedToken;
    let user: any;
    try {
      if (type === 'shareholder') {
        const shareholder = await getShareholderByEmail(email, companyId);
        if (!shareholder) {
          res.status(403).json({ message: "Forbidden: Shareholder not found" });
          return;
        }
        user = shareholder;
      } else if (type === 'director') {
        const director = await getDirectorByEmail(email, companyId);
        if (!director) {
          res.status(403).json({ message: "Forbidden: Director not found" });
          return;
        }
        user = director;
      } else {
        res.status(403).json({ message: "Forbidden: Invalid user type" });
        return;
      }

      req.body.loggedInUser = user;
      const isAllowed = allowedUserTypes.includes(decodedToken.type);
      if (!isAllowed) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      next();
    } catch (err) {
      console.error("Error validating user type:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};