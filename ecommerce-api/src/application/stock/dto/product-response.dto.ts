import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/core/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Product slug' })
  slug: string;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product description' })
  description: string;

  @ApiProperty({ description: 'Available stock' })
  stock: number;

  @ApiProperty({ description: 'Unit price' })
  unitPrice: number;

  @ApiProperty({ description: 'Product images', type: [String] })
  images: string[];

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  static fromEntity(product: Product | null): ProductResponseDto {
    if (!product) return null;

    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.slug = product.slug;
    dto.name = product.product;
    dto.description = product.description;
    dto.stock = product.stock;
    dto.unitPrice = product.unitPrice as any;
    dto.images = product.images;
    dto.createdAt = product.createdAt;
    
    return dto;
  }
}