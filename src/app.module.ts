import { AuthModule } from '@auth/auth.module';
import { CategoriesModule } from '@categories/categories.module';
import { EventsModule } from '@events/events.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';
import { UserEventModule } from './user_event/user_event.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'username',
      password: 'password',
      database: 'development',
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    EventsModule,
    ImagesModule,
    UserEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
