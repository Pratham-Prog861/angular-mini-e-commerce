import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import type { CheckoutFormValue } from '../../../../core/models/checkout.model';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { generateOrderId } from '../../../../shared/utils/faker-generator';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

type CheckoutFormGroup = FormGroup<{
  fullName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  addressLine1: FormControl<string>;
  addressLine2: FormControl<string>;
  city: FormControl<string>;
  state: FormControl<string>;
  postalCode: FormControl<string>;
  country: FormControl<string>;
}>;

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
  rotation: string;
}

@Component({
  selector: 'app-checkout-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, CurrencyFormatPipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent {
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly itemCount = this.cartService.itemsCount;
  readonly totalCents = this.cartService.totalCents;
  readonly hasItems = computed(() => this.itemCount() > 0);

  readonly orderId = signal<string | null>(null);
  readonly orderItemCount = signal<number | null>(null);
  readonly orderTotalCents = signal<number | null>(null);

  readonly orderPhase = signal<'idle' | 'placed' | 'shipped' | 'delivered'>('idle');
  readonly showConfetti = signal(false);

  readonly progressPercent = computed(() => {
    const phase = this.orderPhase();
    if (phase === 'placed') return 20;
    if (phase === 'shipped') return 60;
    if (phase === 'delivered') return 100;
    return 0;
  });

  readonly statusText = computed(() => {
    const phase = this.orderPhase();
    if (phase === 'placed') return 'Your order has been placed successfully!';
    if (phase === 'shipped') return 'Your order is on its way!';
    if (phase === 'delivered') return 'Your order has been delivered!';
    return '';
  });

  readonly confettiPieces = signal<ConfettiPiece[]>([]);

  readonly form: CheckoutFormGroup = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    addressLine1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addressLine2: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('United States', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    if (this.orderPhase() === 'idle' && !this.cartService.hasItems()) {
      this.toastService.info('Your cart is empty.');
      this.router.navigateByUrl('/cart');
    }
  }

  private generateConfetti(): void {
    const colors = [
      '#C75B39', '#B8956E', '#7D8B74', '#1A1A1A', '#E07A5C',
      '#F5F0E8', '#D4A574', '#8B9A6D', '#2D2D2D', '#C9A86C'
    ];
    const shapes = ['', 'rotate(45deg)', 'rotate(90deg)', 'rotate(135deg)', 'rotate(180deg)'];
    
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 60; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1500,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    this.confettiPieces.set(pieces);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toastService.error('Please fix the form errors.');
      return;
    }

    const value: CheckoutFormValue = this.form.getRawValue();
    const orderId = generateOrderId();

    this.orderId.set(orderId);
    this.orderItemCount.set(this.itemCount());
    this.orderTotalCents.set(this.totalCents());

    this.cartService.clear();
    this.toastService.success(`Order placed: ${orderId}`);
    void value;

    this.showConfetti.set(true);
    this.generateConfetti();

    setTimeout(() => {
      this.showConfetti.set(false);
    }, 4000);

    this.orderPhase.set('placed');
    timer(2500, 3000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tick) => {
        if (tick === 0) {
          this.orderPhase.set('shipped');
          return;
        }
        if (tick === 1) {
          this.orderPhase.set('delivered');
        }
      });
  }

  isInvalid(name: keyof CheckoutFormGroup['controls']): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }
}