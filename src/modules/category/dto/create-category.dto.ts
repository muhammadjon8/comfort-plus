import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Fruits',
    minLength: 2,
    maxLength: 50,
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiPropertyOptional({
    example: 'Fresh and organic fruits',
    description: 'Optional description of the category',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/icons/fruit.svg',
    description: 'URL to the icon representing the category',
  })
  @IsString()
  @IsOptional()
  iconUrl?: string;
}
