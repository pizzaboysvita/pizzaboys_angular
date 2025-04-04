import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesPurchase } from '../../../shared/data/reports';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-sales-purchase',
    templateUrl: './sales-purchase.component.html',
    styleUrl: './sales-purchase.component.scss',
    imports: [NgApexchartsModule, CardComponent]
})

export class SalesPurchaseComponent {

  public salesPurchase = SalesPurchase ;

}
