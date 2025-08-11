import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UtilController } from './util.controller';

@Module({
  controllers: [UtilController],
  providers: [PrismaService],
})
export class UtilModule {}
