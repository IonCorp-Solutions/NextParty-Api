import { ForgotPassDto } from '@auth/dto/forgot-pass.dto';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoginUserDto } from '../dto/login.dto';
import { RegisterUserDto } from '../dto/register.dto';
import { AuthService } from './../service/auth.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes('apllication/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstname: {
          example: 'John',
        },
        lastname: {
          example: 'Doe',
        },
        email: {
          example: 'example@example.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
        phone: {
          type: 'string',
          example: '983613568',
        },
        birthday: {
          example: '1999-12-31',
        },
      },
    },
  })
  async register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiConsumes('apllication/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          example: 'example@example.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
      },
    },
  })
  async login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @Post('send-reset-password-email')
  @ApiConsumes('apllication/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          example: 'example@example.com',
        },
      },
    },
  })
  async sendResetPasswordEmail(@Body() email: ForgotPassDto) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  @ApiConsumes('apllication/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          example: '123456',
        },
        new: {
          type: 'string',
          example: '123456',
        },
      },
    },
  })
  async recover(
    @Body()
    data: {
      token: string;
      new: string;
    },
  ) {
    return this.authService.resetPassword(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password/:id')
  @ApiConsumes('apllication/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        new: {
          type: 'string',
          example: '12345678',
        },
        current: {
          type: 'string',
          example: '123456',
        },
      },
    },
  })
  async reset(
    @Param('id') id: number,
    @Body()
    data: {
      new: string;
      current: string;
    },
  ) {
    return this.authService.changePassword(id, data);
  }

  @Get('verify/:token')
  async verify(@Param('token') token: string) {
    return this.authService.tokenVerify(token);
  }
}
