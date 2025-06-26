import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: DatabaseService) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: createCategoryDto });
  }

  async findAllCategories() {
    return await this.prisma.category.findMany();
  }

  async findCategoryById(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async removeCategory(id: string) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
