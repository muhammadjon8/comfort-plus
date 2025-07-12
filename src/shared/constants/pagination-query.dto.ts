import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { PAGINATION } from './pagination.constant';
import { TransformToInt } from '../transformers/transform-to-int.transformer';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @IsOptional()
  @TransformToInt()
  @IsInt()
  @IsPositive()
  page: number = PAGINATION.PAGE;

  @ApiProperty({
    description: 'Limit of items per page for pagination',
    required: false,
    example: 10,
  })
  @IsOptional()
  @TransformToInt()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit: number = PAGINATION.LIMIT;
}
