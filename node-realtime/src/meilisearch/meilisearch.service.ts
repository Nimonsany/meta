import { Injectable, OnModuleInit } from '@nestjs/common';
import Meilisearch from 'meilisearch';

@Injectable()
export class MeilisearchService implements OnModuleInit {
  private client: Meilisearch.Client;
  private productIndex;

  onModuleInit() {
    this.client = new Meilisearch({
      host: process.env.MEILISEARCH_URL,
      apiKey: process.env.MEILISEARCH_MASTER_KEY,
    });
    this.productIndex = this.client.index('products');
  }

  async searchProducts(q: string) {
    const { hits } = await this.productIndex.search(q, {
      limit: 10,
      filter: 'status:published',
    });
    return hits;
  }

  async indexProduct(product: any) {
    await this.productIndex.addOrUpdateDocuments([
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        sellerId: product.sellerId,
        images: product.images,
      },
    ]);
  }

  async updateProduct(product: any) {
    await this.productIndex.updateDocument(product.id, {
      name: product.name,
      description: product.description,
      price: product.price,
      sellerId: product.sellerId,
      images: product.images,
    });
  }

  async deleteProduct(id: string) {
    await this.productIndex.deleteDocument(id);
  }
}