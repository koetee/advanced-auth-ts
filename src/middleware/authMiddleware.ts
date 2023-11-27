import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const tokenFromHeader = req.header("Authorization")?.split(" ")[1];

  const token = tokenFromHeader || req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ error: "Unauthorized - Token not provided" });
    return;
  }

  jwt.verify(token, process.env.SECRET_KEY || "", (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: "Forbidden - Invalid token" });
      return;
    }
    req.user = user as { username: string; role: string };
    next();
  });
};
