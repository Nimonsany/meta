import { Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductSchema } from './product.entity';
import { minioClient } from '../minio';
import { MeilisearchService } from '../meilisearch/meilisearch.service';
import { CartsService } from '../cart/cart.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private meilisearchService: MeilisearchService,
    @Inject(forwardRef(() => CartsService))
    private cartsService: CartsService,
  ) {}

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    return this.productModel.findById(id).exec();
  }

  async create(data: Partial<Product>) {
    const product = new this.productModel(data);
    const saved = await product.save();
    await this.meilisearchService.indexProduct(saved.toJSON());
    return saved;
  }

  async update(id: string, data: Partial<Product>) {
    const updated = await this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (updated) {
      await this.meilisearchService.updateProduct(updated.toJSON());
    }
    return updated;
  }

  async remove(id: string) {
    await this.productModel.findByIdAndDelete(id).exec();
    await this.meilisearchService.deleteProduct(id);
  }

  async uploadImage(filePath: string, publicPath: string) {
    await minioClient.fPutObject(
      'ecommerce',
      publicPath,
      filePath,
      'application/octet-stream',
      { 'public': true },
    );
    return `http://minio:9000/ecommerce/${publicPath}`;
  }

  async syncToMeilisearch(productId: string) {
    const product = await this.findOne(productId);
    await this.meilisearchService.indexProduct(product.toJSON());
  }
}