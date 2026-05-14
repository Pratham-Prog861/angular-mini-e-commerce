import type { Product, ProductId } from './product.model';

export interface CartItem {
  productId: ProductId;
  product: Product;
  quantity: number;
}
