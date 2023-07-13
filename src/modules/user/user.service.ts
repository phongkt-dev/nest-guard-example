import { DbService } from '@modules/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}

  async getUser(id: string) {
    const result = await this.db.user.findFirst({
      where: {
        id,
      },
    });
    if (!result) {
      throw new NotFoundException(`User id ${id} does not exist`);
    }
    return result;
  }

  async createUser(role: UserRole = UserRole.USER) {
    const result = await this.db.user.create({
      data: {
        name: Date.now().toString(),
        role,
      },
    });
    return result;
  }
}
