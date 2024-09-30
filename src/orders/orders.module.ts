import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { envs, NATS_SERVICE } from 'src/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports:[NatsModule],
})
export class OrdersModule {}
