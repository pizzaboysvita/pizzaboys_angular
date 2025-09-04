import { Component } from '@angular/core';

@Component({
  selector: 'app-facebook-advertising',
  standalone: true,
  imports: [],
  templateUrl: './facebook-advertising.component.html',
  styleUrls: ['./facebook-advertising.component.scss'],
})
export class FacebookAdvertisingComponent {
  isFacebookEnabled = false;

  onSave() {
    console.log('Facebook Advertising enabled:', this.isFacebookEnabled);
    
  }
}