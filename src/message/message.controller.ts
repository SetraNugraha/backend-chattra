import {
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { SendMessageDto, SendMessageSchema } from './dto/send-message.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthUserDto } from 'src/auth/dto/auth.user.dto';
import { successResponse } from 'src/utils/responseHandler';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get('/:receiverId')
  async getMessage(
    @AuthUser() authUser: AuthUserDto,
    @Param('receiverId') receiverId: string,
  ) {
    const result = await this.messageService.getMessageByReceiverId(
      authUser.sub,
      receiverId,
    );

    return successResponse('get message success', result);
  }

  @UseGuards(AuthGuard)
  @Post('send/:receiverId')
  @HttpCode(200)
  async sendMessage(
    @AuthUser() authUser: AuthUserDto,
    @Param('receiverId') receiverId: string,
    @Body(new ZodValidationPipe(SendMessageSchema)) payload: SendMessageDto,
  ) {
    const result = await this.messageService.sendMessage(
      authUser.sub,
      receiverId,
      payload.body,
    );

    return successResponse('success send message', result);
  }
}
