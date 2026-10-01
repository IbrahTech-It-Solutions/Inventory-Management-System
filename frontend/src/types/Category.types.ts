export type CategoryClassification =
  | "main-category"
  | "subcategory"
  | "type"
  | "brand"
  | "model"
  | "variant";

export interface Category {
  id: string;
  name: string;
  sku: string;
  classification: CategoryClassification;
  parentCategoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  sku: string;
  classification: CategoryClassification;
  parentCategoryId: string | null;
}