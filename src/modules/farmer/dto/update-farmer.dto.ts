import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsEnum } from 'class-validator';


export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateFarmerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  farmDetails?: string;

  @ApiProperty({ enum: VerificationStatus })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;
}
