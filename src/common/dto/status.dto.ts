import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "src/orders/enums/order.enum";



export class StatusDto{
    @IsOptional()
    @IsEnum(OrderStatusList,{
        message: `Valid status are ${OrderStatusList}`
    })
    status: OrderStatus
}