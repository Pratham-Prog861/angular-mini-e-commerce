import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ProductService } from '../../../core/services/product.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { FiltersComponent } from '../filters/filters.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FiltersComponent, ProductCardComponent, LoaderComponent, EmptyStateComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);

  readonly loading = this.productService.loading;
  readonly products = this.productService.filteredProducts;
  readonly totalCount = computed(() => this.products().length);
}
