import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import type { ProductSort } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  private readonly productService = inject(ProductService);

  readonly categories = this.productService.categories;
  readonly selectedCategory = this.productService.selectedCategory;
  readonly sort = this.productService.sort;
  readonly minCents = this.productService.priceMinCents;
  readonly maxCents = this.productService.priceMaxCents;

  readonly minDollars = computed(() => centsToDollarsInput(this.minCents()));
  readonly maxDollars = computed(() => centsToDollarsInput(this.maxCents()));

  setCategory(value: string): void {
    this.productService.updateFilters({ selectedCategory: value ? value : null });
  }

  setSort(value: string): void {
    this.productService.updateFilters({ sort: value as ProductSort });
  }

  setMinDollars(value: string): void {
    this.productService.updateFilters({ priceMinCents: dollarsToCents(value) });
  }

  setMaxDollars(value: string): void {
    this.productService.updateFilters({ priceMaxCents: dollarsToCents(value) });
  }

  reset(): void {
    this.productService.updateFilters({
      selectedCategory: null,
      priceMinCents: null,
      priceMaxCents: null,
      sort: 'relevance',
    });
  }
}

function dollarsToCents(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const dollars = Number(trimmed);
  if (!Number.isFinite(dollars) || dollars < 0) {
    return null;
  }

  return Math.round(dollars * 100);
}

function centsToDollarsInput(valueCents: number | null): string {
  if (typeof valueCents !== 'number') {
    return '';
  }
  return String((valueCents / 100).toFixed(0));
}
