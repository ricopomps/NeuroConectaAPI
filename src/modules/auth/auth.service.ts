import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FRONT_URL, JWT_SECRET } from "../../config/env";
import { emailService } from "../email/email.service";
import { UserRepository } from "../user/user.repository";

type LoginRequest = {
  email: string;
  password: string;
};

export class AuthService {
  private readonly userRepository = new UserRepository();

  async login({ email, password }: LoginRequest) {
    const user = await this.userRepository.findByEmail(email, true);
    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const userPassword = await this.userRepository.getPasswordById(user.id);

    if (!userPassword) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(password, userPassword);

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET!, {
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async requestPasswordReset(email: string) {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email");
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return { message: "If the email exists, a reset link was sent." };
    }

    const token = jwt.sign({ sub: user.id, type: "reset" }, JWT_SECRET!, {
      expiresIn: "1h",
    });

    const base = FRONT_URL ?? "http://localhost:3000";
    const link = `${base}/auth/reset-password?token=${token}`;

    await emailService.sendPasswordResetEmail(user.email, link, user.name);

    return { message: "If the email exists, a reset link was sent." };
  }

  async resetPassword(token: string, password: string) {
    if (!token || !password) {
      throw new Error("Missing token or password");
    }

    const payload: any = jwt.verify(token, JWT_SECRET!);

    if (!payload?.type || payload.type !== "reset" || !payload?.sub) {
      throw new Error("Invalid token");
    }

    const userId = payload.sub as string;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.update(userId, {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    return { message: "Password updated successfully" };
  }
}
