import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-all-deliveries.use-case';
import { GetCustomerDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-customer-deliveries.use-case';
import { DeliveryResponseDto, OrderInfoDto } from './dto/delivery-response.dto';
import {
  PaginatedResponseDto,
  PaginationQueryDto
} from '../common/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { Delivery } from 'src/core/entities/delivery.entity';

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(
    private readonly getAllDeliveriesUseCase: GetAllDeliveriesUseCase,
    private readonly getCustomerDeliveriesUseCase: GetCustomerDeliveriesUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all deliveries (protected admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of deliveries',
    type: PaginatedResponseDto
  })
  async getAllDeliveries(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<DeliveryResponseDto>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const [deliveries, total] = await this.getAllDeliveriesUseCase.execute(
      page,
      pageSize
    );

    const deliveryDtos = this.mapDeliveriesToDtos(deliveries);
    return new PaginatedResponseDto<DeliveryResponseDto>(
      deliveryDtos,
      total,
      page,
      pageSize
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get deliveries by customer ID (protected)' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of customer deliveries',
    type: [DeliveryResponseDto]
  })
  async getCustomerDeliveries(
    @Param('customerId') customerId: string
  ): Promise<DeliveryResponseDto[]> {
    const deliveries =
      await this.getCustomerDeliveriesUseCase.execute(customerId);
    return this.mapDeliveriesToDtos(deliveries);
  }

  private mapDeliveriesToDtos(deliveries: any[]): DeliveryResponseDto[] {
    return deliveries.map((delivery) => this.deliveryToDto(delivery as Delivery));
  }

  private deliveryToDto(delivery: Delivery): DeliveryResponseDto {
    const order: OrderInfoDto = {
        id: delivery.order!.id,
        productName: delivery.order!.product!.product,
        quantity: delivery.order!.quantity,
        totalPrice: Decimal(Number(delivery.order!.unitPrice) * delivery.order!.quantity)  || Decimal(0),
        deliveryFee: delivery.order!.deliveryFee || Decimal(0),
        customer: {
          id: delivery.order!.customer!.id,
          customerId: delivery.order!.customer!.customerId,
          fullname: delivery.order!.customer!.fullname,
          email: delivery.order!.customer!.email, 
          createdAt: delivery.order!.customer!.createdAt
        },
        address: {
          addressLine1: delivery.order!.address!.addressLine1,
          addressLine2: delivery.order!.address!.addressLine2,
          city: delivery.order!.address!.city,
          region: delivery.order!.address!.region,
          country: delivery.order!.address!.country,
          postalCode: delivery.order!.address!.postalCode,
          contactName: delivery.order!.address!.contactName,
          phoneNumber: delivery.order!.address!.phoneNumber
        }
      };

      return {
        id: delivery.id,
        order,
        status: delivery.status,
        createdAt: delivery.createdAt,
      };

  }


}
