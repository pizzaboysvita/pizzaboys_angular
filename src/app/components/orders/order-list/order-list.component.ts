import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  imports: [CardComponent, TableComponent, RouterModule]
})

export class OrderListComponent {

  orderSummaryCards = [
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-2.png', label: 'Total Orders', count: 80 },
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-3.png', label: 'Cancelled', count: 21 },
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-1.png', label: 'Confirm', count: 78 },
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-4.png', label: 'Preparing', count: 48 },
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-5.png', label: 'Ready For Delivery', count: 42 },
    { icon: 'https://cdn-icons-png.freepik.com/512/7541/7541708.png', label: 'Order On Its Way', count: 20 },
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-8.png', label: 'Pending Orders', count: 30 },
    { icon: 'https://foxpixel.vercel.app/metor/assets/images/food-icon/i-9.png', label: 'Delivered Order', count: 25 },
  ];

  public orderList = [
    {
      order_code: '#ORD-001',
      customer: 'Erma D. Rumph',
      items: ['Margherita Pizza', 'Cheeseburger'],
      quantity: '1<br>2',
      price_per_item: '$16.00<br>$10.00',
      total_price: '$36.00',
      payment_method: 'Online UPI ✅',
      order_date_time: '15-02-2024, 04:27 pm',
      address: '44 Hide A Way, Orlando.',
      delivery_status: 'Ready To Pick',
    },
    {
      order_code: '#ORD-002',
      customer: 'Craig E. Morg',
      items: ['Caesar Salad', 'Veggie Wrap', 'BBQ Chicken Wings'],
      quantity: '2<br>2<br>3',
      price_per_item: '$13.00<br>$9.00<br>$18.00',
      total_price: '$98.00',
      payment_method: 'COD 🟠',
      order_date_time: '19-11-2024, 03:45 pm',
      address: 'Denver Avenue, Edgemt, CA 92',
      delivery_status: 'Out Of Delivery',
    },
    {
      order_code: '#ORD-003',
      customer: 'Laura W. Gibb',
      items: ['Caesar Salad'],
      quantity: '1',
      price_per_item: '$13.00',
      total_price: '$13.00',
      payment_method: 'Online UPI ✅',
      order_date_time: '12-03-2026, 11:15 am',
      address: 'Goldie Lane, Cincinnati, OH',
      delivery_status: 'Delivered',
    },
    {
      order_code: '#ORD-004',
      customer: 'Angela Henry',
      items: ['Greek Gyro', 'Grilled Salmon', 'Shrimp Tacos'],
      quantity: '1<br>1<br>2',
      price_per_item: '$14.00<br>$12.00<br>$10.00',
      total_price: '$36.00',
      payment_method: 'Online UPI ❌',
      order_date_time: '23-01-2027, 02:00 pm',
      address: '1452 Koontz Lane, San Fernando',
      delivery_status: 'Cancel',
    }
  ];

  public tableConfig: TableConfig = {
    columns: [
      { title: "ORDER NO.", dataField: 'order_code' },
      { title: "CUSTOMER", dataField: 'customer' },
      { title: "ITEMS NAME", dataField: 'items' },
      { title: "QUANTITY", dataField: 'quantity' },
      { title: "PRICE PER ITEM", dataField: 'price_per_item' },
      { title: "TOTAL PRICE", dataField: 'total_price' },
      { title: "PAYMENT METHOD", dataField: 'payment_method' },
      { title: "ORDER DATE & TIME", dataField: 'order_date_time' },
      { title: "ADDRESS", dataField: 'address' },
      { title: "DELIVERY STATUS", dataField: 'delivery_status', type: 'html' },
      { title: "ACTION", type: 'option', class: 'text-center' },
    ],
    rowActions: [
      { icon: "ri-eye-line", permission: "show" },
      { icon: "ri-pencil-line", permission: "edit" },
      { icon: "ri-delete-bin-line", permission: "delete" },
    ],
    data: this.orderList,
  };

  ngOnInit() {
    const statusClassMap: Record<string, string> = {
      'Ready To Pick': 'badge rounded border border-warning text-warning px-2 py-1',
      'Out Of Delivery': 'badge rounded border border-primary text-primary px-2 py-1',
      'Delivered': 'badge bg-success text-white px-2 py-1'
    };

    const order = this.orderList.map(element => {
      return {
        ...element,
        customer: `<a href="#" class="text-primary fw-semibold">${element.customer}</a>`,
        items: element.items.map((item: string, index: number) => `<div> ${item}</div>`).join(''),
        delivery_status: element.delivery_status
          ? `<span class="${statusClassMap[element.delivery_status] || 'badge bg-secondary'}">${element.delivery_status}</span>`
          : '-',
      };
    });
    this.tableConfig.data = order;
  }
}