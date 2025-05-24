import { Inject, Injectable } from '@nestjs/common';
import { DeliveryRepositoryPort } from '../../ports/repositories/delivery.repository.port';

@Injectable()
export class GetAllDeliveriesUseCase {
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepository: DeliveryRepositoryPort
  ) {}

  async execute(page: number, pageSize: number) {
    return this.deliveryRepository.findAll(page, pageSize);
  }
}
