import { InstitutionRepository } from "./institution.repository";

export class InstitutionService {
  private institutionRepository = new InstitutionRepository();

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
    return this.institutionRepository.addUser(institutionId, userId);
  }
}
