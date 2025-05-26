import { Module } from '@nestjs/common';
import { WompiGatewayService } from './wompi-gateway.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  providers: [WompiGatewayService],
  exports: [WompiGatewayService, HttpModule],
})
export class WompiGatewayModule {}