import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactService } from 'src/contact/contact.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private contactService: ContactService,
  ) {}

  async getMessageByReceiverId(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new ConflictException('you cant message to your self');
    }

    // Check Receiver is exists
    const receiver = await this.userService.findById(receiverId);
    if (!receiver) {
      throw new NotFoundException('receiver user not found');
    }

    // Only saved contact can send message
    const isInContact = await this.contactService.isInContact(
      senderId,
      receiver.id,
    );
    if (!isInContact) {
      throw new NotFoundException('user not in your contact');
    }

    const result = await this.prisma.message.findMany({
      where: {
        senderId,
        receiverId,
      },
    });

    return result;
  }

  async sendMessage(senderId: string, receiverId: string, body: string) {
    if (senderId === receiverId) {
      throw new ConflictException('you cant message to your self');
    }

    // Check Receiver is exists
    const receiver = await this.userService.findById(receiverId);
    if (!receiver) {
      throw new NotFoundException('receiver user not found');
    }

    // Only saved contact can send message
    const isInContact = await this.contactService.isInContact(
      senderId,
      receiver.id,
    );
    if (!isInContact) {
      throw new NotFoundException('user not in your contact');
    }

    const result = await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        body,
      },
    });

    return result;
  }
}
