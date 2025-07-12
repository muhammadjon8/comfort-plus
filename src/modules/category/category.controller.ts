import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseResponse } from '#/shared/types';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { DateTime } from 'luxon';
import { Category } from './types/category.type';
import { Roles } from '#/shared/decorators/roles.decorator';
import { RolesGuard } from '#/shared/guards/roles.guard';
import { Role } from '#/shared/types/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
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
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
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
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the category' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<BaseResponse<Category>> {
    const data = await this.categoryService.findCategoryById(id);
    if (!data) throw new NotFoundException('Category not found');

    return withBaseResponse({
      success: true,
      message: 'Category retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<BaseResponse<Category>> {
    const data = await this.categoryService.updateCategory(id, updateCategoryDto);
    if (!data) throw new NotFoundException('Category not found');

    return withBaseResponse({
      success: true,
      message: 'Category updated successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async remove(@Param('id') id: string): Promise<BaseResponse<null>> {
    const data = await this.categoryService.removeCategory(id);
    if (!data) throw new NotFoundException('Category not found');

    return withBaseResponse({
      success: true,
      message: 'Category deleted successfully',
      data: null,
      timestamp: DateTime.now().toJSDate(),
    });
  }
}
