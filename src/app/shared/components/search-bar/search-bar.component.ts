import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  value = input<string>('');
  placeholder = input<string>('Search products…');

  valueChange = output<string>();

  onInput(nextValue: string): void {
    this.valueChange.emit(nextValue);
  }
}
