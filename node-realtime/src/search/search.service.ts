import { Injectable, OnModuleInit } from '@nestjs/common';
import Meilisearch from 'meilisearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: Meilisearch.Client;
  private productIndex;

  onModuleInit() {
    this.client = new Meilisearch({
      host: process.env.MEILISEARCH_URL,
      apiKey: process.env.MEILISEARCH_MASTER_KEY,
    });
    this.productIndex = this.client.index('products');
  }

  async search(q: string) {
    const { hits } = await this.productIndex.search(q, {
      limit: 10,
    });
    return hits;
  }

  async getProduct(id: string) {
    return await this.productIndex.getDocument(id);
  }