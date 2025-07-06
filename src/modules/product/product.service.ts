import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from '../database/database.service';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: DatabaseService) {}
  async createProduct(dto: CreateProductDto, userId: string) {
    const farmer = await this.prisma.farmer.findUnique({
      where: { userId },
    });
    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }
    const existing = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
        farmerId: farmer.id,
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
          farmerId: farmer.id,
          categoryId: dto.categoryId,
        },
      }),
    ]);
    if (images.count === 0) {
      throw new ConflictException('Failed to create product images');
    }
    return {
      ...product,
      pricePerUnit: (product.pricePerUnit as Decimal).toNumber(),
      coverImage,
      images: dto.images.map((image) => ({ id: randomUUID(), imageUrl: image })),
    };
  }

  async findAll() {
    const data = await this.prisma.product.findMany({
      include: {
        ProductImages: true,
      },
    });
    return data.map((product) => ({
      ...product,
      pricePerUnit: (product.pricePerUnit as Decimal).toNumber(),
      images: product.ProductImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
    }));
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

    return {
      ...product,
      pricePerUnit: (product.pricePerUnit as Decimal).toNumber(),
      images: product.ProductImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const data = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        ProductImages: true,
      },
    });
    return {
      ...data,
      pricePerUnit: (data.pricePerUnit as Decimal).toNumber(),
      images: data.ProductImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
    };
  }

  async remove(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const farmer = await this.prisma.farmer.findUnique({ where: { userId } });
    if (!farmer) throw new NotFoundException('Farmer not found');

    if (product.farmerId !== farmer.id) {
      throw new ForbiddenException('Not allowed to delete this product');
    }

    const [deletedImages, deletedProduct] = await this.prisma.$transaction([
      this.prisma.productImages.deleteMany({ where: { productId: id } }),
      this.prisma.product.delete({ where: { id } }),
    ]);

    return {
      ...deletedProduct,
      pricePerUnit: (deletedProduct.pricePerUnit as Decimal).toNumber(),
      images: [],
      deletedImagesCount: deletedImages.count,
    };
  }
}
