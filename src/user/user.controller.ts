/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { successResponse } from 'src/utils/responseHandler';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from 'src/utils/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthUserDto } from 'src/auth/dto/auth.user.dto';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'profile_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, heigth: 300, crop: 'limit' }],
  }),
});

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getHello(): string {
    return 'user endpoint';
  }

  @Get('all')
  async getAllUsers() {
    const result = await this.userService.getAllUsers();
    return successResponse('get all user success', result);
  }

  @Get(':userId')
  async findById(@Param('userId') userId: string) {
    const result = await this.userService.findById(userId);
    return successResponse('get user by id success', result);
  }

  @Post('update-profile-image/:userId')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async updateProfileImage(
    @AuthUser() authUser: AuthUserDto,
    @UploadedFile() fileImage: Express.Multer.File,
  ) {
    if (!fileImage) {
      throw new NotFoundException('Image file required');
    }

    const result = await this.userService.updateProfileImage(
      authUser.sub,
      fileImage,
    );

    return successResponse('update profile image success', result);
  }
}
