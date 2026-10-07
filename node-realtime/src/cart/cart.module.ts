import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { CartsService } from './cart.service';

@Module({
  imports: [RedisModule],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartModule {}