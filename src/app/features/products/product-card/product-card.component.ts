import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyFormatPipe, TruncatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  product = input.required<Product>();

  readonly inStock = computed(() => this.product().stock > 0);
  readonly stars = [1, 2, 3, 4, 5];

  addToCart(): void {
    const p = this.product();
    if (p.stock <= 0) {
      this.toastService.error('Out of stock');
      return;
    }

    this.cartService.add(p, 1);
    this.toastService.success('Added to cart');
  }
}
