import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John', minLength: 2, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({ example: 'Doe', minLength: 2, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Length(2, 100)
  email: string;

  @ApiProperty({ example: 'P@ssword123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @ApiProperty({ example: 'P@ssword123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  confirmPassword: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Tashkent, Uzbekistan', minLength: 2, maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  address?: string;
}
