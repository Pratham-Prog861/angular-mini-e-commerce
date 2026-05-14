export type ProductId = string;

export type ProductSort =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc'
  | 'name-desc';

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  category: string;
  imageUrl: string;

  /** Integer cents to avoid floating point rounding issues. */
  priceCents: number;

  /** 0..5 */
  rating: number;
  reviewCount: number;

  /** 0..n */
  stock: number;
}
