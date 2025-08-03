import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<GetUserDto[]> {
    const result = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        phone: true,
        profileImage: true,
      },
    });
    return result || [];
  }

  async findById(userId: string): Promise<GetUserDto | null> {
    if (!userId) {
      throw new BadRequestException('user id required');
    }

    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        phone: true,
        profileImage: true,
      },
    });

    if (!result) {
      throw new NotFoundException('user not found');
    }

    return result;
  }

  async findUserByPhone(phone: string): Promise<GetUserDto | null> {
    return await this.prisma.user.findUnique({
      where: { phone: phone },
      select: {
        id: true,
        username: true,
        phone: true,
        profileImage: true,
      },
    });
  }

  async findUserByUsername(username: string): Promise<GetUserDto | null> {
    return await this.prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
        phone: true,
        profileImage: true,
      },
    });
  }

  async updateToken(userId: string, token: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        token,
      },
    });
  }

  async deleteToken(userId: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        token: null,
      },
    });
  }
}
