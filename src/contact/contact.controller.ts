import { Controller, Param, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Post, Body, Get } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SaveContactDto, SaveContactSchema } from './dto/save-contact.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { AuthUserDto } from 'src/auth/dto/auth.user.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { successResponse } from 'src/utils/responseHandler';

@UseGuards(AuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get('/:ownerId')
  async getContactByOwnerId(@Param('ownerId') ownerId: string) {
    const result = await this.contactService.getContactByOwnerId(ownerId);
    return successResponse('get contact by owner id success', result);
  }

  @Post('save')
  async saveContact(
    @AuthUser() authUser: AuthUserDto,
    @Body(new ZodValidationPipe(SaveContactSchema)) payload: SaveContactDto,
  ) {
    const result = await this.contactService.saveContact(
      authUser.sub,
      payload.phone,
    );

    return successResponse('New contact saved', result);
  }
}
