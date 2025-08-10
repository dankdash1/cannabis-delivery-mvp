import { Controller, Get, Post, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.customers.create(body);
  }

  @Get()
  findAll() {
    return this.customers.findAll();
  }
}
