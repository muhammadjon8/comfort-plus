import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from '../database/database.service';
import { randomUUID } from 'node:crypto';
import { Unit } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: DatabaseService) {}
  async createProduct(dto: CreateProductDto, farmerId: string) {
    const existing = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
        farmerId: farmerId,
      },
    });

    if (existing) {
      throw new ConflictException('You already created a product with this name');
    }
    const coverImage = dto.coverImage ?? 'https://picsum.photos/id/116/200/300';

    const id = randomUUID();
    const [images, product] = await this.prisma.$transaction([
      this.prisma.productImages.createMany({
        data: dto.images.map((image) => ({ imageUrl: image, productId: id })),
      }),
      this.prisma.product.create({
        data: {
          id,
          name: dto.name,
          description: dto.description,
          pricePerUnit: dto.pricePerUnit,
          unit: dto.unit,
          coverImage,
          isAvailable: true,
          stock: dto.stock,
          farmerId,
          categoryId: dto.categoryId,
        },
      }),
    ]);
    if (images.count === 0) {
      throw new ConflictException('Failed to create product images');
    }
    return {
      ...product,
      coverImage,
      images: dto.images,
    };
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        ProductImages: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        ProductImages: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, farmerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NotFoundException('Product not found');
    if (product.farmerId !== farmerId) {
      throw new ForbiddenException('Not allowed to delete this product');
    }

    await this.prisma.$transaction([
      this.prisma.productImages.deleteMany({ where: { productId: id } }),
      this.prisma.product.delete({ where: { id } }),
    ]);

    return { message: 'Product deleted successfully' };
  }
}
