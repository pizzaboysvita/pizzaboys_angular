import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesSummary } from '../../../shared/data/reports';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-sales-summary',
    templateUrl: './sales-summary.component.html',
    styleUrl: './sales-summary.component.scss',
    imports: [NgApexchartsModule, CardComponent]
})

export class SalesSummaryComponent {

  public SalesSummary = SalesSummary;

}
