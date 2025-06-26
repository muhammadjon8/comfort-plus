import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(2, 100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  confirmPassword: string;

  @IsOptional()
  @IsPhoneNumber('UZ')
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  address?: string;
}
