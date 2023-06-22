import { Event } from '@events/entities/event.entity';
import { EventsService } from '@events/service/events.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/service/users.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './service/auth.service';
import { UserEvent } from '@user_event/entities/user_event.entity';
import { ImagesService } from '@images/service/images.service';
import { Image } from '@images/entities/image.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event, UserEvent, Image]),
    JwtModule.register({
      secret: 'SECRETE_KEY',
      signOptions: { expiresIn: '14d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    EventsService,
    ImagesService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
