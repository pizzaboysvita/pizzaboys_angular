import { Component } from '@angular/core';
import { SalesSummaryComponent } from "./sales-summary/sales-summary.component";
import { EmployeesSatisfiedComponent } from "./employees-satisfied/employees-satisfied.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { SalesPurchaseComponent } from "./sales-purchase/sales-purchase.component";
import { SalesPurchaseReturnComponent } from "./sales-purchase-return/sales-purchase-return.component";
import { TransferHistoryComponent } from "./transfer-history/transfer-history.component";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss',
    imports: [SalesSummaryComponent, EmployeesSatisfiedComponent, ExpensesComponent, SalesPurchaseComponent, SalesPurchaseReturnComponent, TransferHistoryComponent]
})
export class ReportsComponent {

}
