import { User } from "../../generated/prisma/client";
import { prisma } from "../../shared/prisma";

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

type UserWithPassword = User & { password?: string };

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string, withPassword = false) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getPasswordById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    return user?.password;
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
    });
  }
}
