import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  findAll() {
    return this.customers.findAll();
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.customers.create({ name: body.name, email: body.email });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customers.remove(id);
  }
}
