export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
  'Grocery',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
