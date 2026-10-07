import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    const cartKey = `cart:userId:${userId}`;
    await this.redis.sadd(cartKey, productId);
    await this.redis.hincrby(cartKey, productId, quantity);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    const cartKey = `cart:userId:${userId}`;
    await this.redis.hdel(cartKey, productId);
    await this.redis.srem(cartKey, productId);
    return this.getCart(userId);
  }

  async getCart(userId: string) {
    const cartKey = `cart:userId:${userId}`;
    const members = await this.redis.smembers(cartKey);
    const quantities = await this.redis.hgetall(cartKey);
    const productIds = members.filter(id => quantities[id]);
    return productIds.map(id => ({ productId: id, quantity: parseInt(quantities[id] || '0') }));
  }

  async clearCart(userId: string) {
    const cartKey = `cart:userId:${userId}`;
    await this.redis.del(cartKey);
  }
}