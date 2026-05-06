import { prisma } from "../../shared/prisma";

export type UpdateInstitutionData = {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
};

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

  async update(id: string, data: UpdateInstitutionData) {
    console.log('____________________________________');
    console.log(data);
    console.log('____________________________________');
    return prisma.institution.update({
      where: { id },
      data: data,
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

  async removeUser(institutionId: string, userId: string) {
    return prisma.institutionUser.deleteMany({
      where: {
        institutionId,
        userId,
      },
    });
  }

  async findUsersByInstitution(
    institutionId: string,
    take: number = 10,
    skip: number = 0,
    search?: string,
    excludeInstitution?: boolean,
  ) {
    const where: any = {};

    if (excludeInstitution) {
      where.institutionUsers = {
        none: {
          institutionId,
        },
      };
    } else {
      where.institutionUsers = {
        some: {
          institutionId,
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({
        where,
      }),
    ]);

    return { users, count };
  }
}
