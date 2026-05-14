import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import type { Product, ProductId, ProductSort } from '../models/product.model';
import { generateCategories, generateProducts } from '../../shared/utils/faker-generator';

export interface ProductFiltersState {
  searchQuery: string;
  selectedCategory: string | null;
  priceMinCents: number | null;
  priceMaxCents: number | null;
  sort: ProductSort;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal(false);

  private readonly _searchQuery = signal('');
  private readonly _selectedCategory = signal<string | null>(null);
  private readonly _priceMinCents = signal<number | null>(null);
  private readonly _priceMaxCents = signal<number | null>(null);
  private readonly _sort = signal<ProductSort>('relevance');

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly searchQuery = this._searchQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly priceMinCents = this._priceMinCents.asReadonly();
  readonly priceMaxCents = this._priceMaxCents.asReadonly();
  readonly sort = this._sort.asReadonly();

  readonly categories = computed(() => generateCategories());

  readonly filteredProducts = computed(() => {
    const query = this._searchQuery().trim().toLowerCase();
    const selectedCategory = this._selectedCategory();
    const min = this._priceMinCents();
    const max = this._priceMaxCents();
    const sort = this._sort();

    let items = this._products();

    if (selectedCategory) {
      items = items.filter((p) => p.category === selectedCategory);
    }

    if (typeof min === 'number') {
      items = items.filter((p) => p.priceCents >= min);
    }

    if (typeof max === 'number') {
      items = items.filter((p) => p.priceCents <= max);
    }

    if (query) {
      items = items.filter((p) => {
        return (
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      });
    }

    const sorted = [...items];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'relevance':
      default:
        // Keep generated order as a stable default.
        break;
    }

    return sorted;
  });

  constructor() {
    // Auto-load catalog once; keep it deterministic.
    this.loadProducts();

    // Reset price range if user enters an invalid range.
    effect(() => {
      const min = this._priceMinCents();
      const max = this._priceMaxCents();
      if (typeof min === 'number' && typeof max === 'number' && min > max) {
        this._priceMaxCents.set(min);
      }
    });
  }

  loadProducts(): void {
    if (this._loading()) {
      return;
    }

    this._loading.set(true);
    timer(450)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const products = generateProducts({ count: 48, seed: 42 });
        this._products.set(products);
        this._loading.set(false);
      });
  }

  getById(id: ProductId): Product | null {
    return this._products().find((p) => p.id === id) ?? null;
  }

  updateFilters(partial: Partial<ProductFiltersState>): void {
    if (typeof partial.searchQuery === 'string') {
      this._searchQuery.set(partial.searchQuery);
    }

    if ('selectedCategory' in partial) {
      this._selectedCategory.set(partial.selectedCategory ?? null);
    }

    if ('priceMinCents' in partial) {
      this._priceMinCents.set(
        typeof partial.priceMinCents === 'number' ? partial.priceMinCents : null,
      );
    }

    if ('priceMaxCents' in partial) {
      this._priceMaxCents.set(
        typeof partial.priceMaxCents === 'number' ? partial.priceMaxCents : null,
      );
    }

    if (partial.sort) {
      this._sort.set(partial.sort);
    }
  }

  clearFilters(): void {
    this._searchQuery.set('');
    this._selectedCategory.set(null);
    this._priceMinCents.set(null);
    this._priceMaxCents.set(null);
    this._sort.set('relevance');
  }
}
