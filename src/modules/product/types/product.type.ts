import { UnitType } from './unit.type';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  stock: number;
  pricePerUnit: number;
  unit: UnitType;
  isAvailable: boolean;
  coverImage: string | null;
  images: { id: string; imageUrl: string }[];
  categoryId: string;
  farmerId: string;
  createdAt: Date;
  updatedAt: Date;
};
