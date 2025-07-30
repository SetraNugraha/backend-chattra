import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { GuardModule } from 'src/guards/guard.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [GuardModule, UserModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
