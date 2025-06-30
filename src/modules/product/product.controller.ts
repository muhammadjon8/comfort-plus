import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../shared/guards/current-user.guard';
import { JwtPayload } from '../auth/types';
import { BaseResponse } from '../../shared/types';
import { Product } from './types/product.type';
import { withBaseResponse } from '../../shared/utils/with-base-response.util';
import { DateTime } from 'luxon';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.FARMER, Role.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponse<Product>> {
    const data = await this.productService.createProduct(createProductDto, user.id);
    return withBaseResponse({
      success: true,
      message: 'Product created successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get()
  async findAll(): Promise<BaseResponse<Product[]>> {
    const data = await this.productService.findAll();
    return withBaseResponse({
      success: true,
      message: 'Products retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse<Product>> {
    const data = await this.productService.findOne(id);
    return withBaseResponse({
      success: true,
      message: 'Product retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<BaseResponse<Product>> {
    const data = await this.productService.update(id, updateProductDto);
    return withBaseResponse({
      success: true,
      message: 'Product updated successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER)
  @Delete(':id')
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
