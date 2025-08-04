import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { GetUserDto } from 'src/user/dto/get-user.dto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async isInContact(ownerId: string, savedId: string) {
    return await this.prisma.contact.findUnique({
      where: {
        ownerId_savedId: {
          ownerId,
          savedId,
        },
      },
    });
  }

  async getContactByOwnerId(ownerId: string) {
    if (!ownerId) {
      throw new NotFoundException('owner id required');
    }

    const contacts = await this.prisma.contact.findMany({
      where: {
        ownerId: ownerId,
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });

    const result: GetUserDto[] =
      contacts.map((contact) => contact.users as GetUserDto) || [];

    return result;
  }

  async saveContact(ownerId: string, phone: string) {
    // Check phone are already register or no
    const existsUser = await this.userService.findUserByPhone(phone);
    if (!existsUser) {
      throw new NotFoundException({
        message: 'Validation error',
        fieldErrors: {
          phone: ['Phone number not found'],
        },
      });
    }

    if (ownerId === existsUser.id) {
      throw new ConflictException({
        message: 'Validation error',
        fieldErrors: {
          phone: ['you cant save your own phone number'],
        },
      });
    }

    // Validate contact already saved or no
    const hasSaved = await this.prisma.contact.findUnique({
      where: {
        ownerId_savedId: {
          ownerId: ownerId,
          savedId: existsUser.id,
        },
      },
    });

    if (hasSaved) {
      throw new ConflictException({
        message: 'Validation error',
        fieldErrors: {
          phone: [`${phone} already saved in your contact`],
        },
      });
    }

    // Save contact
    return await this.prisma.contact.create({
      data: {
        ownerId: ownerId,
        savedId: existsUser.id,
      },
    });
  }
}
