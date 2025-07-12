import { Module } from '@nestjs/common';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FarmerController],
  providers: [FarmerService],
  exports: [],
})
export class FarmerModule {}
