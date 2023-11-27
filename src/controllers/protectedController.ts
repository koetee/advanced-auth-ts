import { Request, Response } from "express";

export const protectedRoute = (req: Request, res: Response): void => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
};
