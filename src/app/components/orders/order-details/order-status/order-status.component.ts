import { Component } from '@angular/core';
import { ShippingDetails } from '../../../../shared/data/orders';

@Component({
    selector: 'app-order-status',
    imports: [],
    templateUrl: './order-status.component.html',
    styleUrl: './order-status.component.scss'
})

export class OrderStatusComponent {

  public ShippingDetails = ShippingDetails ;

}
