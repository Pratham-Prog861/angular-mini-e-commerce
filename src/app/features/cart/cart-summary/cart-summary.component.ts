import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-cart-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyFormatPipe],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.css',
})
export class CartSummaryComponent {
  private readonly cartService = inject(CartService);

  readonly itemCount = this.cartService.itemsCount;
  readonly subtotalCents = this.cartService.subtotalCents;
  readonly totalCents = this.cartService.totalCents;
  readonly hasItems = computed(() => this.itemCount() > 0);
}
