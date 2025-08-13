import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesSummary } from '../../../shared/data/reports';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
  selector: 'app-sales-summary-chart',
  imports: [NgApexchartsModule, CardComponent],
  templateUrl: './sales-summary-chart.component.html',
  styleUrl: './sales-summary-chart.component.scss'
})
export class SalesSummaryChartComponent {
  public SalesSummary = SalesSummary;
}
