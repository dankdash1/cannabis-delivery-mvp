import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function toInt(v: any, d=1) {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) && n > 0 ? n : d;
}

@Controller()
export class UtilController {
  constructor(private prisma: PrismaService) {}

  @Get('/stats')
  async stats() {
    const [customers, products, orders, revenueAgg] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { totalCents: true } }),
    ]);
    return {
      customers,
      products,
      orders,
      totalRevenueCents: revenueAgg._sum.totalCents || 0,
    };
  }

  @Get('/util/customers')
  async pagedCustomers(@Query('page') pageQ: string, @Query('pageSize') sizeQ: string, @Query('q') q?: string) {
    const page = toInt(pageQ, 1);
    const pageSize = toInt(sizeQ, 10);
    const skip = (page - 1) * pageSize;
    const where = q ? {
      OR: [
        { name:  { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    } : {};
    const [total, items] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({ where, skip, take: pageSize, orderBy: { id: 'desc' } }),
    ]);
    return { page, pageSize, total, items };
  }

  @Get('/util/products')
  async pagedProducts(@Query('page') pageQ: string, @Query('pageSize') sizeQ: string, @Query('q') q?: string) {
    const page = toInt(pageQ, 1);
    const pageSize = toInt(sizeQ, 10);
    const skip = (page - 1) * pageSize;
    const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({ where, skip, take: pageSize, orderBy: { id: 'desc' } }),
    ]);
    return { page, pageSize, total, items };
  }

  @Get('/util/orders')
  async pagedOrders(
    @Query('page') pageQ: string,
    @Query('pageSize') sizeQ: string,
    @Query('q') q?: string,
    @Query('status') status?: string,
  ) {
    const page = toInt(pageQ, 1);
    const pageSize = toInt(sizeQ, 10);
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (status) where.status = status as any;
    if (q) {
      where.OR = [
        { customer: { name:  { contains: q, mode: 'insensitive' } } },
        { customer: { email: { contains: q, mode: 'insensitive' } } },
        { items: { some: { product: { name: { contains: q, mode: 'insensitive' } } } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where, skip, take: pageSize, orderBy: { id: 'desc' },
        include: { customer: true, items: { include: { product: true } } },
      }),
    ]);
    return { page, pageSize, total, items };
  }
}
