import { Component } from '@angular/core';
import { MenuCategoryComponent } from "./menu-category/menu-category.component";
import { OrderReportsComponent } from "./order-reports/order-reports.component";
import { SalesFiguresComponent } from "./sales-figures/sales-figures.component";
import { TrendingOrdersComponent } from "./trending-orders/trending-orders.component";
import { WelcomeCardComponent } from "./welcome-card/welcome-card.component";
import { TopChartComponent } from "./top-chart/top-chart.component";
import { CustomerRate, TotalProfit, TotalSale } from '../../shared/data/dashboard';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [WelcomeCardComponent, MenuCategoryComponent, OrderReportsComponent,
        SalesFiguresComponent, TrendingOrdersComponent, TopChartComponent]
})

export class DashboardComponent {

    public TotalSale = TotalSale;
    public TotalProfit = TotalProfit;
    public CustomerRate = CustomerRate;

}
