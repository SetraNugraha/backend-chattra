/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterSchema } from './dto/register.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { Response, Request } from 'express';
import { successResponse } from 'src/utils/responseHandler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) payload: RegisterDto,
  ) {
    const result = await this.authService.register(payload);
    return successResponse('register success', result);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) phone: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(phone, res);
    return successResponse('Login success', result);
  }

  @Get('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['refresh_token'];
    const result = await this.authService.refreshToken(token, res);
    return successResponse('resfreh token success', result);
  }

  @Delete('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    await this.authService.logout(token, res);

    return {
      success: true,
      message: 'Logout success',
    };
  }
}
