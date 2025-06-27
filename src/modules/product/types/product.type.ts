import { Unit } from './units.type';

export type Product = {
  id: string;
  name: string;
  description: string;
  stock: number;
  pricePerUnit: number;
  unit: Unit;
  isAvailable: boolean;
  coverImage: string;
  images: string[];
  tags: string[];
  categoryId: string;
  farmerId: string;
  createdAt: Date;
  updatedAt: Date;
};
