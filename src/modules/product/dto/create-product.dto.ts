import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Unit, UnitType } from '../types/unit.type';

export class CreateProductDto {
  @ApiProperty({ example: 'Fresh Tomatoes', minLength: 2, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiPropertyOptional({ example: 'Organic farm-grown tomatoes' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({ example: 5.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerUnit: number;

  @ApiProperty({ enum: Unit, example: Unit.KG })
  @IsEnum(Unit)
  unit: UnitType;

  @ApiProperty({ example: 'c44d56a3-5be3-4d77-b47a-8364c4b30f51' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

}
