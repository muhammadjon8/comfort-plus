import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { DatabaseService } from '../database/database.service';
import { Hasher } from '../../shared/libs/hasher.lib';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(registerDto: RegisterDto): Promise<UserDto> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const email = registerDto.email.toLowerCase();
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber: registerDto.phoneNumber }],
      },
    });
    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.phoneNumber === registerDto.phoneNumber) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    const hashedPassword = await Hasher.hashValue(registerDto.password);

    const userData = {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      ...(registerDto.phoneNumber && { phoneNumber: registerDto.phoneNumber }),
      ...(registerDto.address && { address: registerDto.address }),
    };

    const newUser = await this.prisma.user.create({
      data: userData,
    });
    return newUser as UserDto;
  }
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
