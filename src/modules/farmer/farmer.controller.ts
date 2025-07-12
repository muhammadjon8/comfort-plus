import { Body, Controller, Post, Get, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { FilterFarmerDto } from './dto/filter-farmer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '#/shared/guards/roles.guard';
import { Roles } from '#/shared/decorators/roles.decorator';
import { Role } from '#/shared/types/role.enum';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '#/shared/guards/current-user.guard';
import { FarmerService } from './farmer.service';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { DateTime } from 'luxon';

@ApiTags('Farmer')
@Controller('farmer')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Post('request')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send request to become a farmer' })
  @ApiResponse({ status: 201, description: 'Farmer request sent' })
  async createFarmerRequest(@Body() dto: CreateFarmerDto, @CurrentUser() user) {
    const data = await this.farmerService.createFarmerRequest(dto, user.id);
    return withBaseResponse({
      success: true,
      message: 'Farmer request sent successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all farmers with filters' })
  @ApiResponse({ status: 200, description: 'List of farmers returned' })
  async getAllFarmers(@Query() filters: FilterFarmerDto) {
    const data = await this.farmerService.getAllFarmers(filters);
    return withBaseResponse({
      success: true,
      message: 'Farmers retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a farmer by ID' })
  @ApiResponse({ status: 200, description: 'Farmer retrieved successfully' })
  async getFarmerById(@Param('id') id: string) {
    const data = await this.farmerService.getFarmerById(id);
    return withBaseResponse({
      success: true,
      message: 'Farmer retrieved successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update farmer (admin only)' })
  @ApiResponse({ status: 200, description: 'Farmer updated successfully' })
  async updateFarmer(@Param('id') id: string, @Body() dto: UpdateFarmerDto) {
    const data = await this.farmerService.updateFarmer(id, dto);
    return withBaseResponse({
      success: true,
      message: 'Farmer updated successfully',
      data,
      timestamp: DateTime.now().toJSDate(),
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a farmer (admin only)' })
  @ApiResponse({ status: 200, description: 'Farmer deleted successfully' })
  async deleteFarmer(@Param('id') id: string){
    await this.farmerService.deleteFarmer(id);
    return withBaseResponse({
      success: true,
      message: 'Farmer deleted successfully',
      data: null,
      timestamp: DateTime.now().toJSDate(),
    });
  }
}
