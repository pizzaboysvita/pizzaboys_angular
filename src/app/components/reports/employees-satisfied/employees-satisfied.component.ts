import { Component } from '@angular/core';
import { EmployeesSatisfied } from '../../../shared/data/reports';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-employees-satisfied',
    templateUrl: './employees-satisfied.component.html',
    styleUrl: './employees-satisfied.component.scss',
    imports: [NgApexchartsModule, CardComponent]
})

export class EmployeesSatisfiedComponent {

  public EmployeesSatisfied = EmployeesSatisfied ;

}
