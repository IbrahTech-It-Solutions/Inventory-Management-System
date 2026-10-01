import type { CategoryClassification } from "../types/Category.types";

export const CATEGORY_CLASSIFICATIONS: {
  value: CategoryClassification;
  label: string;
}[] = [
  {
    value: "main-category",
    label: "Main Category",
  },
  {
    value: "subcategory",
    label: "Subcategory",
  },
  {
    value: "type",
    label: "Type",
  },
  {
    value: "brand",
    label: "Brand",
  },
  {
    value: "model",
    label: "Model",
  },
  {
    value: "variant",
    label: "Variant",
  },
];