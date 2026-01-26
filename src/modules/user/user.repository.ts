export class UserRepository {
  async create(data: any) {
    // MOCK — depois vira banco
    return {
      id: "uuid-mock",
      ...data,
    };
  }
}
