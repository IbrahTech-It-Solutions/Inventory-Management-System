import type { Category } from "../types/Category.types";
import type { ProductCategorySelection } from "../types/Product.types";

const SKU_PREFIXES = {
  mainCategoryId: "M",
  subcategoryId: "S",
  typeId: "T",
  brandId: "B",
  modelId: "M",
  variantId: "V",
} as const;

const getCategorySku = (
  categories: Category[],
  categoryId: string,
): string => {
  if (!categoryId) {
    return "000";
  }

  const category = categories.find(
    (item) => item.id === categoryId,
  );

  return category?.sku?.trim().toUpperCase() || "000";
};

export const generateProductSku = (
  categories: Category[],
  selection: ProductCategorySelection,
): string => {
  return [
    `${SKU_PREFIXES.mainCategoryId}${getCategorySku(
      categories,
      selection.mainCategoryId,
    )}`,
    `${SKU_PREFIXES.subcategoryId}${getCategorySku(
      categories,
      selection.subcategoryId,
    )}`,
    `${SKU_PREFIXES.typeId}${getCategorySku(
      categories,
      selection.typeId,
    )}`,
    `${SKU_PREFIXES.brandId}${getCategorySku(
      categories,
      selection.brandId,
    )}`,
    `${SKU_PREFIXES.modelId}${getCategorySku(
      categories,
      selection.modelId,
    )}`,
    `${SKU_PREFIXES.variantId}${getCategorySku(
      categories,
      selection.variantId,
    )}`,
  ].join("-");
};