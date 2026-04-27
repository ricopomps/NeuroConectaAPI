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

  async listByInstitution(institutionId: string) {
    return prisma.user.findMany({
      where: {
        institutionUsers: {
          some: {
            institutionId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
