import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetProductStockUseCase } from 'src/core/use-cases/stock/get-product-stock.use-case';
import { GetAllProductsUseCase } from 'src/core/use-cases/stock/get-all-products.use-case';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../common/pagination.dto';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(
    private readonly getProductStockUseCase: GetProductStockUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
  ) {}

  @Get('products/:slug')
  @ApiOperation({ summary: 'Get product by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Product slug' })
  @ApiResponse({
    status: 200,
    description: 'Product details with available stock',
    type: ProductResponseDto,
  })
  async getProductBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    const product = await this.getProductStockUseCase.execute(slug);
    return ProductResponseDto.fromEntity(product);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products (public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of products',
    type: PaginatedResponseDto,
  })
  async getAllProducts(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const [products, total] = await this.getAllProductsUseCase.execute(page, pageSize);
    
    const productDtos = products.map(product => ProductResponseDto.fromEntity(product));
    return new PaginatedResponseDto<ProductResponseDto>(productDtos, total, page, pageSize);
  }
}