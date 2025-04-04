import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card',
    imports: [],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss'
})

export class CardComponent {

  @Input() cardClass : string;
  @Input() cardHeaderClass : string;
  @Input() cardBodyClass : string;
  @Input() cardFooterClass : string;
  @Input() header : boolean;
  @Input() body : boolean;
  @Input() footer : boolean;
  @Input() card : boolean;

}
