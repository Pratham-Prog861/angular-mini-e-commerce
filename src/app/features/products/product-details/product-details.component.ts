import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoaderComponent, EmptyStateComponent, CurrencyFormatPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  readonly loading = this.productService.loading;
  readonly stars = [1, 2, 3, 4, 5];

  readonly productId = toSignal(this.route.paramMap.pipe(map((pm) => pm.get('id'))), {
    initialValue: null,
  });

  readonly product = computed(() => {
    const id = this.productId();
    if (!id) {
      return null;
    }
    return this.productService.getById(id);
  });

  addToCart(): void {
    const p = this.product();
    if (!p) {
      return;
    }
    if (p.stock <= 0) {
      this.toastService.error('Out of stock');
      return;
    }
    this.cartService.add(p, 1);
    this.toastService.success('Added to cart');
  }
}
