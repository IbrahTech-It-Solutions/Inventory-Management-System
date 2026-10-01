import type {
  BaseUnit,
  ProductQuality,
} from "../types/Product.types";

export const PRODUCT_QUALITIES: {
  value: ProductQuality;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export const BASE_UNITS: {
  value: BaseUnit;
  label: string;
}[] = [
  { value: "piece", label: "Piece" },
  { value: "box", label: "Box" },
  { value: "pack", label: "Pack" },
  { value: "kg", label: "Kilogram" },
  { value: "g", label: "Gram" },
  { value: "liter", label: "Liter" },
  { value: "meter", label: "Meter" },
];