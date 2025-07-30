import { Controller, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Post, Body } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SaveContactDto, SaveContactSchema } from './dto/save-contact.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { AuthUserDto } from 'src/auth/dto/auth.user.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';

@UseGuards(AuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('save')
  async saveContact(
    @AuthUser() authUser: AuthUserDto,
    @Body(new ZodValidationPipe(SaveContactSchema)) payload: SaveContactDto,
  ) {
    const result = await this.contactService.saveContact(
      authUser.sub,
      payload.phone,
    );
    return {
      success: true,
      message: 'New contact saved',
      data: result,
    };
  }
}
