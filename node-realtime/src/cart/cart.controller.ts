import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CartsService } from './cart.service';

@Controller('api/node/cart')
export class CartController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('add')
  async addToCart(@Body() body: { userId: string; productId: string; quantity?: number }) {
    return this.cartsService.addToCart(body.userId, body.productId, body.quantity);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartsService.getCart(userId);
  }

  @Post('remove')
  async removeFromCart(@Body() body: { userId: string; productId: string }) {
    return this.cartsService.removeFromCart(body.userId, body.productId);
  }
}