export type ProductQuality =
  | "new"
  | "excellent"
  | "good"
  | "fair"
  | "poor";

export type BaseUnit =
  | "piece"
  | "bag"
  | "box"
  | "pack"
  | "kg"
  | "g"
  | "liter"
  | "meter";

export type ProductCategorySelection = {
  mainCategoryId: string;
  subcategoryId: string;
  typeId: string;
  brandId: string;
  modelId: string;
  variantId: string;
};

export interface Product {
  id: string;
  name: string;
  images: string[];
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  quality: ProductQuality;
  description: string;
  baseUnit: BaseUnit;
  barcode: string | null;

  mainCategoryId: string | null;
  subcategoryId: string | null;
  typeId: string | null;
  brandId: string | null;
  modelId: string | null;
  variantId: string | null;

  sku: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  images: string[];
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  quality: ProductQuality;
  description: string;
  baseUnit: BaseUnit;
  barcode: string | null;

  mainCategoryId: string | null;
  subcategoryId: string | null;
  typeId: string | null;
  brandId: string | null;
  modelId: string | null;
  variantId: string | null;
}