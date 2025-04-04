import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-top-chart',
    templateUrl: './top-chart.component.html',
    styleUrl: './top-chart.component.scss',
    imports: [NgApexchartsModule, CardComponent]
})

export class TopChartComponent {

  @Input() data : any

}
