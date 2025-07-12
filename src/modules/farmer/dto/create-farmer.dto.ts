import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateFarmerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  farmDetails?: string;
}
