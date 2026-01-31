import bcrypt from "bcrypt";
import { CreateUserData, UserRepository } from "./user.repository";

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

    return user;
  }
}
