import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/node/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Param('q') q: string) {
    return this.searchService.search(q);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.searchService.getProduct(id);
  }
}