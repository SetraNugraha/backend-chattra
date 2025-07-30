import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { successResponse } from 'src/utils/responseHandler';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userServie: UserService) {}

  @Get()
  getHello(): string {
    return 'user endpoint';
  }

  @Get('all')
  async getAllUsers() {
    const result = await this.userServie.getAllUsers();
    return successResponse('get all user success', result);
  }
}
