import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesPurchase } from '../../../shared/data/reports';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
  selector: 'app-sales-purchase-chart',
  imports: [NgApexchartsModule, CardComponent],
  templateUrl: './sales-purchase-chart.component.html',
  styleUrl: './sales-purchase-chart.component.scss'
})
export class SalesPurchaseChartComponent {

  public salesPurchase = SalesPurchase ;

}
