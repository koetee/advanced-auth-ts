import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user";
import validator from "validator";
import constants from "../config/constants";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!validator.isAlphanumeric(username)) {
      res.status(400).json({ error: "Invalid username" });
      return;
    }

    if (!validator.isLength(password, { min: 6 })) {
      res
        .status(400)
        .json({ error: "Password should be at least 6 characters long" });
      return;
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      res.status(400).json({ error: "User with this username already exists" });
      return;
    }

    const existingUserByIP = await User.findOne({ ipAddress: req.ip });
    if (existingUserByIP) {
      res
        .status(400)
        .json({ error: "User with this IP address already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, constants.SALT_ROUNDS);

    const newUser: UserDocument = new User({
      username,
      password: hashedPassword,
      ipAddress: req.ip,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    if (
      user &&
      user.loginAttempts >= constants.MAX_LOGIN_ATTEMPTS &&
      Date.now() - user.lockUntil! < constants.LOCK_TIME
    ) {
      res.status(401).json({ error: "Account locked. Try again later." });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await User.updateOne(
        { username },
        {
          $inc: { loginAttempts: 1 },
          $set:
            user.loginAttempts + 1 >= constants.MAX_LOGIN_ATTEMPTS
              ? { lockUntil: Date.now() + constants.LOCK_TIME }
              : {},
        }
      );

      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    if (user.loginAttempts > 0) {
      await User.updateOne({ username }, { $set: { loginAttempts: 0 } });
    }

    user.loginAttempts = 0;
    await user.save();

    const refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.SECRET_KEY || "",
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.SECRET_KEY || "",
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token found" });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.SECRET_KEY || "",
      async (err: any, decoded: any) => {
        if (err) {
          res.status(401).json({ error: "Invalid refresh token" });
        } else {
          const { username, role } = decoded;

          const user = await User.findOne({ username });

          if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
          }

          const accessToken = jwt.sign(
            { username, role },
            process.env.SECRET_KEY || "",
            { expiresIn: "1h" }
          );

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });
          res.status(200).json({ accessToken });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
