import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

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

  async saveContact(ownerId: string, phone: string) {
    // Check phone are already register or no
    const existsUser = await this.userService.findUserByPhone(phone);
    if (!existsUser) {
      throw new NotFoundException('Phone number not found');
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
      throw new ConflictException(`${phone} already saved in your contact`);
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
