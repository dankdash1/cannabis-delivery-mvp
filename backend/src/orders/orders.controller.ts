import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() body: { customerId: number; items: Array<{ productId: number; qty: number }> }) {
    return this.svc.create(body);
  }

  @Patch(':id')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.svc.updateStatus(id, body.status);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.delete(id);
  }
}
