import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../user/user.repository";

type LoginRequest = {
  email: string;
  password: string;
};

export class AuthService {
  private userRepository = new UserRepository();

  async login({ email, password }: LoginRequest) {
    const user = await this.userRepository.findByEmail(email, true);
    console.log(user);
    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const userPassword = await this.userRepository.getPasswordById(user.id);
    console.log(userPassword);

    if (!userPassword) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(password, userPassword);

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
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
}
