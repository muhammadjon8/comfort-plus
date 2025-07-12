import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { FilterFarmerDto } from './dto/filter-farmer.dto';

@Injectable()
export class FarmerService {
  constructor(private readonly prisma: DatabaseService) {}

  async createFarmerRequest(dto: CreateFarmerDto, userId: string) {
    const existing = await this.prisma.farmer.findFirst({ where: { userId } });
    if (existing) throw new ConflictException('You have already requested to become a farmer.');

    return this.prisma.farmer.create({
      data: {
        userId,
        location: dto.location,
        farmDetails: dto.farmDetails,
        verificationStatus: 'PENDING',
      },
    });
  }

  async getAllFarmers(filters: FilterFarmerDto) {
    return this.prisma.farmer.findMany({
      where: {
        ...(filters.location && { location: { contains: filters.location, mode: 'insensitive' } }),
        ...(filters.rating && { rating: { gte: filters.rating } }),
        ...(filters.verificationStatus && { verificationStatus: filters.verificationStatus }),
      },
      include: { user: true },
    });
  }

  async getFarmerById(id: string) {
    const farmer = await this.prisma.farmer.findUnique({ where: { id }, include: { user: true } });
    if (!farmer) throw new NotFoundException('Farmer not found');
    return farmer;
  }

  async updateFarmer(id: string, dto: UpdateFarmerDto) {
    const farmer = await this.prisma.farmer.findUnique({ where: { id } });
    if (!farmer) throw new NotFoundException('Farmer not found');

    return this.prisma.farmer.update({ where: { id }, data: dto });
  }

  async deleteFarmer(id: string) {
    const farmer = await this.prisma.farmer.findUnique({ where: { id } });
    if (!farmer) throw new NotFoundException('Farmer not found');

    return this.prisma.farmer.delete({ where: { id } });
  }
}
