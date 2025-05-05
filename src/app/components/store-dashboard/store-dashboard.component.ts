import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TopChartComponent } from "../dashboard/top-chart/top-chart.component";
import {
  CustomerRate,
  TotalProfit,
  TotalSale,
} from "../../shared/data/dashboard";
import { SalesSummaryChartComponent } from "./sales-summary-chart/sales-summary-chart.component";
import { SalesPurchaseChartComponent } from "./sales-purchase-chart/sales-purchase-chart.component";

import { CommonModule } from "@angular/common";
@Component({
  selector: "app-store-dashboard",
  templateUrl: "./store-dashboard.component.html",
  imports: [
    SalesSummaryChartComponent,
    SalesPurchaseChartComponent,
    TopChartComponent,
    CommonModule,
    FormsModule,
  ],
})
export class StoreDashboardComponent {
  public TotalSale = TotalSale;
  public TotalProfit = TotalProfit;
  public CustomerRate = CustomerRate;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  submit() {
    console.log("Selected Range:", this.fromDate, this.toDate);
  }
}
