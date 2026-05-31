import bcrypt from "bcrypt";
import { CreateUserData, UpdateUserData, UserRepository } from "./user.repository";
import { emailService } from "../email/email.service";

export class UserService {
  private readonly userRepository = new UserRepository();

  async getUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async getUserById(userId: string) {
    return await this.userRepository.findById(userId);
  }

  async createUser({ name, email, password }: CreateUserData) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

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
