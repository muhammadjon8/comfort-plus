import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/guards/current-user.guard';
import { JwtPayload } from '../auth/types';
import { BaseResponse } from '../../shared/types';
import { Product } from './types/product.type';
import { withBaseResponse } from '../../shared/utils/with-base-response.util';
import { DateTime } from 'luxon';
import { Role } from '../../shared/types/role.enum';
import { ProductFilterDto } from './dto/filter-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Multer.File[],
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponse<Product>> {
    const data = await this.productService.createProduct(createProductDto, user.id, files);
    return withBaseResponse({
      success: true,
      message: 'Product created successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with optional filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() filters: ProductFilterDto): Promise<BaseResponse<Product[]>> {
    const { data, limit, page, total } = await this.productService.findAll(filters);
    return withBaseResponse({
      success: true,
      message: 'Products retrieved successfully',
      data,
      metadata: { pagination: { page, limit, total } },
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  async findOne(@Param('id') id: string): Promise<BaseResponse<Product>> {
    const data = await this.productService.findOne(id);
    return withBaseResponse({
      success: true,
      message: 'Product retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<BaseResponse<Product>> {
    const data = await this.productService.update(id, updateProductDto);
    return withBaseResponse({
      success: true,
      message: 'Product updated successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<BaseResponse<Product>> {
    const data = await this.productService.remove(id, user.id);
    return withBaseResponse({
      success: true,
      message: 'Product deleted successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }
}
