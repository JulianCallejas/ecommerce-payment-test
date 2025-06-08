import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedProductsUseCase } from 'src/core/use-cases/seed/seed-products.use-case';
import { ProductResponseDto } from '../stock/dto/product-response.dto';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedProductsUseCase: SeedProductsUseCase) {}
  @Post('products')
  @ApiOperation({ summary: 'Seed products (protected admin)' })
  @ApiResponse({
    status: 201,
    description: 'Products created',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Products already seeded',
    type: String,
  })
  async seedProducts(): Promise<ProductResponseDto[]> {
    const products = await this.seedProductsUseCase.execute();
    return products.map(product => ProductResponseDto.fromEntity(product));
  }
}