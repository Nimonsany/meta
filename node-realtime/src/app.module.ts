import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IoModule } from 'socket.io';
import { MinioModule } from 'minio';
import { MeilisearchModule } from 'meilisearch';
import { RedisModule } from './redis/redis.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { SearchModule } from './search/search.module';
import { ChatModule } from './chat/chat.module';
import { DeliveryModule } from './delivery/delivery.module';
import { MapsModule } from './maps/maps.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    RedisModule,
    ProductsModule,
    CartModule,
    SearchModule,
    ChatModule,
    DeliveryModule,
    MapsModule,
    AuthModule,
  ],
})
export class AppModule {}