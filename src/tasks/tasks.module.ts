import { Module } from '@nestjs/common';
import { CartCleanupTask } from './cart-cleanup.task';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [CartCleanupTask],
})
export class TasksModule {}
