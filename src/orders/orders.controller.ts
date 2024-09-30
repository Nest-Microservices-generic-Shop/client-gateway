import { Controller, Get, Post, Body, Patch, Param, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from '../common/dto/pagination-dto';
import { OrderPaginationDto, StatusDto } from 'src/common/dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) 
    private readonly client:ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send("createOrder", createOrderDto)
    .pipe(catchError(err => {throw new RpcException(err)}));
  }

  @Get()
  findAll(@Query() PaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', PaginationDto)
    .pipe(catchError(err => { throw new RpcException(err) }));
  }

  @Get('status/:status')
  findAllByStatus( 
    @Query() PaginationDto: PaginationDto, 
    @Param() statusDto: StatusDto) {
    return this.client.send('findAllOrders', 
      {status: statusDto.status,
         ...PaginationDto
      })
      .pipe(catchError(err => {throw new RpcException(err)}));
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder',{id})
    .pipe(catchError(err => {throw new RpcException(err)}));
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() statusDto:StatusDto
  ){
    return this.client.send('changeOrderStatus', {id, ...statusDto})
    .pipe(catchError(err => {throw new RpcException(err)}));
  }


}
