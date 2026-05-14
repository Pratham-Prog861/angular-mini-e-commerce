import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    valueCents: number | null | undefined,
    currency: string = 'USD',
    locale: string = 'en-US',
  ): string {
    const cents = typeof valueCents === 'number' ? valueCents : 0;
    const amount = cents / 100;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
