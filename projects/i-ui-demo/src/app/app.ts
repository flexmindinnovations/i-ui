import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IButtonComponent } from '../../../i-ui/src/lib/components/i-button.component';
import { provideIcons } from '@ng-icons/core';
import { featherLoader } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-root',
  imports: [IButtonComponent],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  viewProviders: [provideIcons({ featherLoader })]
})
export class App {
  protected title = 'i-ui-demo';
}
