import { faker } from '@faker-js/faker';

import { PRODUCT_CATEGORIES } from '../../core/constants/categories';
import type { Product } from '../../core/models/product.model';

export interface GenerateProductsOptions {
  count: number;
  seed: number;
  categories?: readonly string[];
}

const DEFAULT_SEED = 42;

export function generateCategories(): readonly string[] {
  return PRODUCT_CATEGORIES;
}

export function generateProducts(options?: Partial<GenerateProductsOptions>): Product[] {
  const count = options?.count ?? 48;
  const seed = options?.seed ?? DEFAULT_SEED;
  const categories = options?.categories ?? PRODUCT_CATEGORIES;

  faker.seed(seed);

  return Array.from({ length: count }).map((): Product => {
    const id = faker.string.uuid();
    const category = faker.helpers.arrayElement(categories);
    const priceCents = faker.number.int({ min: 499, max: 199_99 });
    const rating = faker.number.float({ min: 3, max: 5, multipleOf: 0.1 });
    const reviewCount = faker.number.int({ min: 0, max: 1500 });
    const stock = faker.number.int({ min: 0, max: 40 });

    // Deterministic, public placeholder image (not base64).
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(id)}/900/900`;

    return {
      id,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category,
      imageUrl,
      priceCents,
      rating,
      reviewCount,
      stock,
    };
  });
}

export function generateOrderId(seed?: number): string {
  if (typeof seed === 'number') {
    faker.seed(seed);
  }

  const prefix = 'ORD';
  const code = faker.string.alphanumeric({ length: 10, casing: 'upper' });
  return `${prefix}-${code}`;
}
