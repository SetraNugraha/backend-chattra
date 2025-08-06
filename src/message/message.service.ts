import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactService } from 'src/contact/contact.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private contactService: ContactService,
    private messageGateway: MessageGateway,
  ) {}

  async getConversation(authUserId: string, otherId: string) {
    if (authUserId === otherId) {
      throw new ConflictException('you cant message to your self');
    }

    // Check Receiver is exists
    const receiver = await this.userService.findById(otherId);
    if (!receiver) {
      throw new NotFoundException('receiver user not found');
    }

    // Only saved contact can send message
    const isInContact = await this.contactService.isInContact(
      authUserId,
      receiver.id,
    );
    if (!isInContact) {
      throw new NotFoundException('user not in your contact');
    }

    const result = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: authUserId,
            receiverId: otherId,
          },
          {
            senderId: otherId,
            receiverId: authUserId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
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

    this.messageGateway.sendMessageToReceiver(receiverId, result);

    return result;
  }
}
