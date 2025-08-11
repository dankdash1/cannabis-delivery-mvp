import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getStats() {
    const [customers, products, orders, revenue, recentOrders] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { totalCents: true } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { id: 'desc' },
        include: { customer: true, items: { include: { product: true } } },
      }),
    ]);

    return {
      customers,
      products,
      orders,
      totalRevenueCents: revenue._sum.totalCents ?? 0,
      recentOrders,
    };
  }
}
