import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from '../../../shared/constants/sort-order.constant';
import { Unit } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/constants/pagination-query.dto';

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
  NAME = 'name',
}

export class ProductFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy: ProductSortBy = ProductSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(Unit)
  unit: Unit = Unit.KG;

  @IsOptional()
  @IsEnum(SortOrder)
  orderBy: SortOrder = SortOrder.Asc;
}
