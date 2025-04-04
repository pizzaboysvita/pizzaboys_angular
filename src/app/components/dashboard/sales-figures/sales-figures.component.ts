import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import { optionsEarning } from '../../../shared/data/dashboard';

@Component({
    selector: 'app-sales-figures',
    templateUrl: './sales-figures.component.html',
    styleUrl: './sales-figures.component.scss',
    imports: [CardComponent, NgApexchartsModule]
})

export class SalesFiguresComponent {

   public optionsEarning = optionsEarning ;

}
