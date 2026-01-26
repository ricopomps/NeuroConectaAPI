import { prisma } from "../../shared/prisma";

export class InstitutionRepository {
  async create(name: string, ownerId: string) {
    return prisma.institution.create({
      data: {
        name,
        users: {
          create: {
            userId: ownerId,
          },
        },
      },
    });
  }

  async findByUser(userId: string, includeUsers = false) {
    return prisma.institution.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: includeUsers
        ? {
            users: { include: { user: true } },
          }
        : undefined,
    });
  }

  async addUser(institutionId: string, userId: string) {
    return prisma.institutionUser.create({
      data: {
        institutionId,
        userId,
      },
    });
  }
}
