import { UserRepository } from "../user/user.repository";
import { InstitutionRepository } from "./institution.repository";

export class InstitutionService {
  private institutionRepository = new InstitutionRepository();
  private userRepository = new UserRepository();

  async createInstitution(name: string, ownerId: string) {
    if (!name) {
      throw new Error("Institution name is required");
    }

    return this.institutionRepository.create(name, ownerId);
  }

  async listUserInstitutions(userId: string) {
    return this.institutionRepository.findByUser(userId);
  }

  async addUserToInstitution(institutionId: string, userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const result = await this.institutionRepository.addUser(
      institutionId,
      userId,
    );
    if (!result) {
      throw new Error("Falha ao adicionar usuário à instituição");
    }

    return user;
  }

  async removeUserFromInstitution(institutionId: string, userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const result = await this.institutionRepository.removeUser(
      institutionId,
      userId,
    );
    if (result.count === 0) {
      throw new Error("Usuário não está na instituição");
    }

    return user;
  }

  async listInstitutionUsers(
    institutionId: string,
    take: number = 10,
    skip: number = 0,
    search?: string,
    excludeInstitution?: boolean,
  ) {
    return this.institutionRepository.findUsersByInstitution(
      institutionId,
      take,
      skip,
      search,
      excludeInstitution,
    );
  }
}
