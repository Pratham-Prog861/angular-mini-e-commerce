import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, SearchBarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);

  readonly cartCount = this.cartService.itemsCount;
  readonly searchQuery = this.productService.searchQuery;
  readonly hasSearch = computed(() => this.searchQuery().trim().length > 0);

  onSearch(value: string): void {
    this.productService.updateFilters({ searchQuery: value });
  }

  clearSearch(): void {
    this.productService.updateFilters({ searchQuery: '' });
  }
}
