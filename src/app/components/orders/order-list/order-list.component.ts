import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { OrderList } from '../../../shared/data/orders';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrl: './order-list.component.scss',
    imports: [CardComponent, TableComponent, RouterModule]
})

export class OrderListComponent {

  public orderList = OrderList;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Order Image", dataField: 'order_image', type: 'image' },
      { title: "Order Code", dataField: 'order_code' },
      { title: "Date", dataField: 'date' },
      { title: "Payment Method", dataField: 'payment_method' },
      { title: "Delivery Status", dataField: 'delivery_status' },
      { title: "Amount", dataField: 'amount' },
      { title: "Options", type: 'option', class: 'text-center' },
      { title: "Tracking", dataField: 'tracking' },
    ],
    rowActions: [
      { icon: "ri-eye-line", permission: "show" },
      { icon: "ri-pencil-line", permission: "edit" },
      { icon: "ri-delete-bin-line", permission: "delete" },
    ],
    data: this.orderList,
  };

  ngOnInit() {
    let order = this.orderList.map(element => {
      return {
        ...element,
        delivery_status: element.delivery_status = element.delivery_status ? `<span class="font-${element.status_class} f-w-500">${element.delivery_status}</span>` : '-',
        tracking: element.tracking ? element.tracking : null,
        trackingRoute: element.tracking ? `/orders/order-tracking` : null
      };
    });
    this.tableConfig.data = this.orderList ? order : [];
  }

}
