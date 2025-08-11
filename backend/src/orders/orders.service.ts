import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.order.findMany({
      orderBy: { id: 'desc' },
      include: { customer: true, items: { include: { product: true } } },
    });
  }

  async get(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(input: { customerId: number; items: Array<{ productId: number; qty: number }> }) {
    if (!input.items?.length) throw new BadRequestException('items required');

    const productIds = Array.from(new Set(input.items.map(i => i.productId)));
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, priceCents: true, active: true },
    });
    const priceMap = new Map(products.map(p => [p.id, p.priceCents]));

    let total = 0;
    for (const item of input.items) {
      const price = priceMap.get(item.productId);
      if (price == null) throw new BadRequestException(`Invalid product ${item.productId}`);
      total += price * item.qty;
    }

    return this.prisma.order.create({
      data: {
        customerId: input.customerId,
        totalCents: total,
        items: { create: input.items.map(i => ({ productId: i.productId, qty: i.qty })) },
      },
      include: { customer: true, items: { include: { product: true } } },
    });
  }

  updateStatus(id: number, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async delete(id: number) {
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    return this.prisma.order.delete({ where: { id } });
  }
}
