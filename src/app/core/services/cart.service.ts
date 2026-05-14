import { Injectable, computed, effect, inject, signal } from '@angular/core';

import type { CartItem } from '../models/cart-item.model';
import type { Product, ProductId } from '../models/product.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'angular-shop.cart.v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);

  private readonly _items = signal<CartItem[]>(this.storage.getJson<CartItem[]>(STORAGE_KEY) ?? []);

  readonly items = this._items.asReadonly();

  readonly itemsCount = computed(() => {
    return this._items().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotalCents = computed(() => {
    return this._items().reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  });

  readonly totalCents = computed(() => this.subtotalCents());

  constructor() {
    effect(() => {
      this.storage.setJson(STORAGE_KEY, this._items());
    });
  }

  add(product: Product, quantity = 1): void {
    const qty = clampInt(quantity, 1, 99);
    this._items.update((items) => {
      const idx = items.findIndex((i) => i.productId === product.id);
      if (idx < 0) {
        return [...items, { productId: product.id, product, quantity: qty }];
      }

      const next = [...items];
      const existing = next[idx]!;
      next[idx] = { ...existing, quantity: clampInt(existing.quantity + qty, 1, 99) };
      return next;
    });
  }

  remove(productId: ProductId): void {
    this._items.update((items) => items.filter((i) => i.productId !== productId));
  }

  setQuantity(productId: ProductId, quantity: number): void {
    const qty = clampInt(quantity, 1, 99);
    this._items.update((items) => {
      const idx = items.findIndex((i) => i.productId === productId);
      if (idx < 0) {
        return items;
      }
      const next = [...items];
      next[idx] = { ...next[idx]!, quantity: qty };
      return next;
    });
  }

  clear(): void {
    this._items.set([]);
  }

  hasItems(): boolean {
    return this._items().length > 0;
  }
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, Math.trunc(value)));
}
