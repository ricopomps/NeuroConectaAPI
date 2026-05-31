import { TokenType } from "../../generated/prisma/client";
import { prisma } from "../../shared/prisma";

export class TokenRepository {
  async invalidateByEmail(email: string, type: TokenType) {
    return prisma.actionToken.updateMany({
      where: {
        email,
        type,
        used: false,
      },
      data: {
        used: true,
      },
    });
  }

  async createToken(
    email: string,
    type: TokenType,
    token: string,
    expiresAt: Date,
  ) {
    return prisma.actionToken.create({
      data: {
        email,
        type,
        token,
        expiresAt,
      },
    });
  }

  async findValidToken(email: string, type: TokenType, token: string) {
    return prisma.actionToken.findFirst({
      where: {
        email,
        type,
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async markTokenUsed(id: string) {
    return prisma.actionToken.update({
      where: { id },
      data: { used: true },
    });
  }
}
