import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisSerivce } from './redis/index.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService, RedisSerivce, PrismaService],
})
export class AppModule {}
