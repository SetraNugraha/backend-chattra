import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { GuardModule } from 'src/guards/guard.module';
import { UserModule } from 'src/user/user.module';
import { ContactModule } from 'src/contact/contact.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [GuardModule, UserModule, ContactModule],
  providers: [MessageService, MessageGateway],
  controllers: [MessageController],
  exports: [],
})
export class MessageModule {}
