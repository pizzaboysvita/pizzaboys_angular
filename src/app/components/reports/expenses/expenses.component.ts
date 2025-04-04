import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Expenses } from '../../../shared/data/reports';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrl: './expenses.component.scss',
    imports: [NgApexchartsModule, CardComponent]
})

export class ExpensesComponent {

  public Expenses = Expenses ;

}
