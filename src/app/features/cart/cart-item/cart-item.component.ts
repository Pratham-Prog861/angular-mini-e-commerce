import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { CartItem } from '../../../core/models/cart-item.model';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-cart-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyFormatPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  private readonly cartService = inject(CartService);

  item = input.required<CartItem>();

  readonly lineTotalCents = computed(() => {
    const i = this.item();
    return i.product.priceCents * i.quantity;
  });

  decrement(): void {
    const i = this.item();
    this.cartService.setQuantity(i.productId, Math.max(1, i.quantity - 1));
  }

  increment(): void {
    const i = this.item();
    this.cartService.setQuantity(i.productId, Math.min(99, i.quantity + 1));
  }

  setQuantity(value: string): void {
    const qty = Number(value);
    if (!Number.isFinite(qty)) {
      return;
    }
    this.cartService.setQuantity(this.item().productId, qty);
  }

  remove(): void {
    this.cartService.remove(this.item().productId);
  }
}
