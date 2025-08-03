/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { successResponse } from 'src/utils/responseHandler';

// @UseGuards(AuthGuard)
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
}
