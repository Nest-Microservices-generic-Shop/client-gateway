import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) 
    private readonly client: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.client.send({cmd:'create_product'}, createProductDto)
    .pipe(catchError(err => {throw new RpcException(err)}));
  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto ){
    
    try {
      const products = await firstValueFrom(
        this.client.send({cmd:'find_all'}, paginationDto)
      );

      return products;
      
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'find_one'},{ id })
    .pipe(catchError(err => {throw new RpcException(err)}));
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({cmd:'find_one'},{ id })
    //   );

    //   return product;
      
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Patch(':id')
  patchProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto){
    return this.client.send({cmd:'update_product'}, {id, ...updateProductDto})
    .pipe(catchError(err => {throw new RpcException(err)}));
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'delete_product'}, {id})
    .pipe(catchError(err => {throw new RpcException(err)}));
  }
}
