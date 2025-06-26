import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [],
  providers: [UsersService, DatabaseService],
  exports: [UsersService],
})
export class UsersModule {}
