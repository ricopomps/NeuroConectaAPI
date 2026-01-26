import { UserRepository } from "./user.repository";

export class UserService {
  private userRepository = new UserRepository();

  async getUser(userUuid: string) {
    return await this.userRepository.findById("joao@email.com");
  }

  async createUser(data: any) {
    if (!data.email) {
      throw new Error("Email é obrigatório");
    }

    const user = await this.userRepository.create(data);
    return user;
  }
}
