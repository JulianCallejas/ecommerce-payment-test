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

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(
    private readonly getAllDeliveriesUseCase: GetAllDeliveriesUseCase,
    private readonly getCustomerDeliveriesUseCase: GetCustomerDeliveriesUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all deliveries (protected)' })
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
  @ApiOperation({ summary: 'Get deliveries by customer ID' })
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
    return deliveries.map((delivery) => {
      const order: OrderInfoDto = {
        id: delivery.order?.id,
        productName: delivery.order?.product?.product || 'N/A',
        quantity: delivery.order?.quantity,
        totalPrice: Decimal(delivery.order?.unitPrice * delivery.order?.quantity)  || Decimal(0),
        deliveryFee: delivery.order?.deliveryFee || 0,
        customer: {
          id: delivery.order?.customer?.id,
          customerId: delivery.order?.customer?.customerId,
          fullname: delivery.order?.customer?.fullname,
          email: delivery.order?.customer?.email,
          phone: delivery.order?.customer?.phone,
          createdAt: delivery.order?.customer?.createdAt
        },
        address: {
          addressLine1: delivery.address?.addressLine1,
          addressLine2: delivery.address?.addressLine2,
          city: delivery.address?.city,
          region: delivery.address?.region,
          country: delivery.address?.country,
          postalCode: delivery.address?.postalCode,
          contact: delivery.address?.contact,
          phoneNumber: delivery.address?.phoneNumber
        }
      };

      return {
        id: delivery.id,
        status: delivery.status,
        createdAt: delivery.createdAt,
        order
      };
    });
  }
}
