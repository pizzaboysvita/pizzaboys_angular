import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { userPosition } from '../../../shared/data/reports';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
    selector: 'app-sales-purchase-return',
    templateUrl: './sales-purchase-return.component.html',
    styleUrl: './sales-purchase-return.component.scss',
    imports: [CardComponent, NgApexchartsModule]
})

export class SalesPurchaseReturnComponent {

    public userPosition = userPosition ;

}
