/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    try {
      const { username, phone } = payload;

      const sanitizedUsername = username.trim().replace(/\s+/g, ' ');

      // Find Exists username or phone
      const existsPhone = await this.userService.findUserByPhone(phone);
      const existsUsername =
        await this.userService.findUserByUsername(sanitizedUsername);

      if (existsPhone) {
        throw new ConflictException({
          message: 'Validation failed',
          fieldErrors: {
            phone: ['phone already exists'],
          },
        });
      }

      if (existsUsername) {
        throw new ConflictException({
          message: 'Validation failed',
          fieldErrors: {
            phone: ['username already exists'],
          },
        });
      }

      // Register User
      const result = await this.prisma.user.create({
        data: {
          phone,
          username: sanitizedUsername,
        },
      });

      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      console.log('register error: ', error);
      throw new InternalServerErrorException(
        'register failed, internal server error',
      );
    }
  }

  generateToken(payload: { sub: string; phone: string }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async login(phone: LoginDto, res: Response) {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: phone,
    });

    // Check phone
    if (!user) {
      throw new NotFoundException({
        fieldErrors: { phone: ['phone not register yet.'] },
      });
    }

    // Set Payload
    const payload = { sub: user.id, phone: user.phone };
    const tokens = this.generateToken(payload);

    // Update token on db
    await this.userService.updateToken(user.id, tokens.refreshToken);

    // Set token to cookies
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken: tokens.accessToken };
  }

  async refreshToken(token: string, res: Response) {
    if (!token) {
      throw new NotFoundException('refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN,
      });

      const tokens = this.generateToken({
        sub: payload.sub,
        phone: payload.phone,
      });

      // Update token on db
      await this.userService.updateToken(payload.sub, tokens.refreshToken);

      // Set token to cookies
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { accessToken: tokens.accessToken };
    } catch (error) {
      console.error('refresh token error: ', error);
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('Invalid refresh token');
      }

      throw new InternalServerErrorException('Internal server error');
    }
  }

  async logout(token: string, res: Response) {
    if (token) {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN,
      });

      await this.userService.deleteToken(payload.sub);
    }

    res.clearCookie('refresh_token');
  }
}
