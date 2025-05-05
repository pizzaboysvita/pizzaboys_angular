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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatIconModule,
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
