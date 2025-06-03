import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from 'src/core/use-cases/transactions/create-transaction.use-case';
import { GetAllTransactionsUseCase } from 'src/core/use-cases/transactions/get-all-transactions.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../common/pagination.dto';
import { GetTransactionStatusUseCase } from 'src/core/use-cases/transactions/get-transaction-status.use-case';
import { TransactionDetailsResponseDto } from './dto/transaction-details-response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private readonly getTransactionStatusUseCase: GetTransactionStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: TransactionResponseDto,
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return await this.createTransactionUseCase.execute(createTransactionDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: PaginatedResponseDto,
  })
  async getAllTransactions(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<TransactionResponseDto>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const [transactions, total] = await this.getAllTransactionsUseCase.execute(page, pageSize);
    
    const transactionDtos = transactions.map(transaction => ({
      transactionId: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      orderId: transaction.orderId,
      customerName: transaction.order?.customer?.fullname,
      productName: transaction.order?.product?.product,
    }));
    
    return new PaginatedResponseDto<TransactionResponseDto>(transactionDtos, total, page, pageSize);
  }

  @Get(':transactionId')
  @ApiOperation({ summary: 'Get transaction details' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: TransactionDetailsResponseDto,
  })
  async getTransaction(
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionDetailsResponseDto> {
     return await this.getTransactionStatusUseCase.execute(transactionId);
  }


}