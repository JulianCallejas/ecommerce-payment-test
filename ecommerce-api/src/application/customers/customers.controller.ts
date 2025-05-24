import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { GetAllCustomersUseCase } from 'src/core/use-cases/customers/get-all-customers.use-case';
import { GetCustomerWithOrdersUseCase } from 'src/core/use-cases/customers/get-customer-with-orders.use-case';
import { CustomerResponseDto } from './dto/customer-response.dto';
import {
  PaginatedResponseDto,
  PaginationQueryDto
} from '../common/pagination.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly getCustomerWithOrdersUseCase: GetCustomerWithOrdersUseCase
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all customers (protected)' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: PaginatedResponseDto
  })
  async getAllCustomers(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<CustomerResponseDto>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const [customers, total] = await this.getAllCustomersUseCase.execute(
      page,
      pageSize
    );

    const customerDtos = customers.map((customer) => ({
      id: customer.id,
      customerId: customer.customerId,
      fullname: customer.fullname,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt
    }));

    return new PaginatedResponseDto<CustomerResponseDto>(
      customerDtos,
      total,
      page,
      pageSize
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer details',
    type: CustomerResponseDto
  })
  async getCustomerById(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerWithOrdersUseCase.execute(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return {
      id: customer.id,
      customerId: customer.customerId,
      fullname: customer.fullname,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt
    };
  }
}
