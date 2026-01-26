import { prisma } from "../../shared/prisma";

export class UserRepository {
  async findById(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }
}
