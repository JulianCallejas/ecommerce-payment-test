import { Inject, Injectable } from "@nestjs/common";
import { OrderRepositoryPort } from "src/core/ports/repositories/order.repository.port";

@Injectable()
export class GetOrderIdUseCase {
  constructor(
      @Inject('OrderRepositoryPort')
      private readonly orderRepository: OrderRepositoryPort
    ) {}
  

  async execute(id: string) {
    return this.orderRepository.findById(id);
  }
}