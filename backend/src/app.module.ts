import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UtilModule } from './util/util.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CustomersModule, ProductsModule, OrdersModule, UtilModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
