import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Unit, UnitType } from '../types/unit.type';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerUnit: number;

  @IsEnum(Unit)
  unit: UnitType;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  coverImage?: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  images: string[];
}
