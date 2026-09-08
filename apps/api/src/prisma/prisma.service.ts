import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      console.warn('⚠️  Database not connected yet. Start Docker first: docker compose up -d');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
