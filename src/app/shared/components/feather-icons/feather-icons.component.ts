import { Component, Input } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
    selector: 'app-feather-icons',
    imports: [],
    templateUrl: './feather-icons.component.html',
    styleUrl: './feather-icons.component.scss'
})

export class FeatherIconsComponent {

  @Input() icons: string | any;
  @Input() class: string | any;

  ngAfterViewInit() {
    feather.replace();
  }

}
