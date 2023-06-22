import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  start(): string {
    return 'move to /auth/login to get token';
  }
}
