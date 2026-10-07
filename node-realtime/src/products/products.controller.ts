import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';

@Controller('api/node/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async search(@Param('q') q: string) {
    // Search via Meilisearch
    return this.productsService.meilisearchService.searchProducts(q);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() data: ProductDto) {
    return this.productsService.create(data);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.productsService.uploadImage(file.path, file.filename);
    const product = await this.productsService.update(id, { images: [url] });
    return { product, imageUrl: url };
  }
}