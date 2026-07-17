import { Injectable } from '@nestjs/common';
import { RedisSerivce } from './redis/index.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisSerivce) {}

  async getHello(): Promise<string> {
    await this.redisService.set('user:1', 'John');
    return 'Hello World';
  }

  async getUser() {
    const value = await this.redisService.get('user:1');
    const bike = await this.redisService.get('bike:1');
    return { value, bike };
  }
}
