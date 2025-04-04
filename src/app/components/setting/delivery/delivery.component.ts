import { Component } from '@angular/core';
import { DropdownComponent } from "../widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-delivery',
    templateUrl: './delivery.component.html',
    styleUrl: './delivery.component.scss',
    imports: [DropdownComponent]
})

export class DeliveryComponent {

  public delivery = ['Morning','Noon','Afternoon','Evening'];
  public deliveryTime = ['8.00 AM - 12.00 AM','12.00 PM - 2.00 PM','02.00 PM - 05.00 PM','05.00 PM - 08.00 PM'];

}
