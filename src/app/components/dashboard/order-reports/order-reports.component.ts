import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { OrderReport } from '../../../shared/data/dashboard';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-order-reports',
    templateUrl: './order-reports.component.html',
    styleUrl: './order-reports.component.scss',
    imports: [CardComponent, CommonModule, TableComponent]
})

export class OrderReportsComponent {

    public orderReport = OrderReport;

    public tableConfig: TableConfig = {
        columns: [
            { title: "Food", dataField: 'order_name' },
            { title: "Customer", dataField: 'customer' },
            { title: "Order Date", dataField: 'date' },
            { title: "Price", dataField: 'price' },
            { title: "Status", dataField: 'status' },
        ],
        data: this.orderReport,
    };

    ngOnInit() {
        let order = this.orderReport.map(element => {
            return {
                ... element,
                order_name: element.order_name ? `<div class="table-image"><img src="${element.image_url}" class="img-fluid" alt=""><h5>${element.order_name}</h5></div>` : '-',
                status: element.status ? `<div class="${element.status}"><span>${element.status}</span></div>` : '-'

            }
        })
        this.tableConfig.data = this.orderReport ? order : [];
    }

}
