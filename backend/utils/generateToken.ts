import jwt from "jsonwebtoken";
import type { UserType } from "../types/user.types";

export const generateToken = (user: UserType) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};