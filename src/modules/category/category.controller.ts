import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseResponse } from '../../shared/types';
import { withBaseResponse } from '../../shared/utils/with-base-response.util';
import { DateTime } from 'luxon';
import { Category } from './types/category.type';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<BaseResponse<Category>> {
    const data = await this.categoryService.createCategory(createCategoryDto);
    return withBaseResponse({
      success: true,
      message: 'Category created successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get()
  async findAllCategories(): Promise<BaseResponse<Category[]>> {
    const data = await this.categoryService.findAllCategories();
    return withBaseResponse({
      success: true,
      message: 'Categories retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<BaseResponse<Category>> {
    const data = await this.categoryService.findCategoryById(id);
    if (!data) {
      throw new NotFoundException('Category not found');
    }
    return withBaseResponse({
      success: true,
      message: 'Category retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<BaseResponse<Category>> {
    const data = await this.categoryService.updateCategory(id, updateCategoryDto);
    if (!data) {
      throw new NotFoundException('Category not found');
    }
    return withBaseResponse({
      success: true,
      message: 'Category updated successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponse<null>> {
    const data = await this.categoryService.removeCategory(id);
    if (!data) {
      throw new NotFoundException('Category not found');
    }
    return withBaseResponse({
      success: true,
      message: 'Category deleted successfully',
      data: null,
      timestamp: DateTime.now().toJSDate(),
    });
  }
}
