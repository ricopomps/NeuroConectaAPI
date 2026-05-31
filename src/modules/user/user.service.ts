import bcrypt from "bcrypt";
import { EMAIL_CONFIRMATION_CODE_TTL_MINUTES } from "../../config/env";
import { emailService } from "../email/email.service";
import { TokenRepository } from "./confirmation-code.repository";
import {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from "./user.repository";

const CONFIRMATION_CODE_TTL_MINUTES = Number.isNaN(
  Number(EMAIL_CONFIRMATION_CODE_TTL_MINUTES),
)
  ? 15
  : Number(EMAIL_CONFIRMATION_CODE_TTL_MINUTES);

export class UserService {
  private readonly userRepository = new UserRepository();
  private readonly tokenRepository = new TokenRepository();

  async getUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async getUserById(userId: string) {
    return await this.userRepository.findById(userId);
  }

  private generateConfirmationCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async requestConfirmationCode(email: string) {
    const emailInUse = await this.userRepository.findByEmail(email);

    if (emailInUse) {
      throw new Error("Email já cadastrado");
    }

    await this.tokenRepository.invalidateByEmail(email, "ACCOUNT_CONFIRMATION");

    const code = this.generateConfirmationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + CONFIRMATION_CODE_TTL_MINUTES,
    );

    await this.tokenRepository.createToken(
      email,
      "ACCOUNT_CONFIRMATION",
      code,
      expiresAt,
    );
    await emailService.sendAccountConfirmationCode(email, code);

    return {
      message: "Código de confirmação enviado",
      expiresInMinutes: CONFIRMATION_CODE_TTL_MINUTES,
    };
  }

  async createUser({
    name,
    email,
    password,
    confirmationCode,
  }: CreateUserData) {
    if (!confirmationCode) {
      throw new Error("Código de confirmação é obrigatório");
    }

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Email já cadastrado");
    }

    const validCode = await this.tokenRepository.findValidToken(
      email,
      "ACCOUNT_CONFIRMATION",
      confirmationCode,
    );

    if (!validCode) {
      throw new Error("Código de confirmação inválido ou expirado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      confirmationCode,
    });

    await this.tokenRepository.markTokenUsed(validCode.id);

    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (err) {
      console.error("Failed to send welcome email", err);
    }

    return user;
  }

  async updateUser(userId: string, { name, email, password }: UpdateUserData) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists && userExists.id !== userId) {
      throw new Error("Email já cadastrado");
    }

    const newData: UpdateUserData = { name, email, password: undefined };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      newData.password = hashedPassword;
    }

    const user = await this.userRepository.update(userId, newData);

    return user;
  }

  async listUsersByInstitution(institutionId: string) {
    return await this.userRepository.listByInstitution(institutionId);
  }

  async list() {
    return await this.userRepository.list();
  }
}
