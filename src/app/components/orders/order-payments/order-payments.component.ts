import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-payments',
  imports: [],
  templateUrl: './order-payments.component.html',
  styleUrl: './order-payments.component.scss'
})
export class OrderPaymentsComponent {
  @Input() data: any;
splitBy = 2;
  splitRows: any;
  isSplitPayment: boolean=false;
  activeTab: string = 'full'; // default tab
  totalPrice: any;

 constructor(public activeModal: NgbActiveModal, ) {}

  ngOnInit(): void {
console.log(this.data);
this.calculateTotal()

  }
 calculateTotal(): void {
    this.totalPrice = this.data.reduce(
      (sum: number, row: { item_total_price: any; }) => sum + (Number(row.item_total_price) || 0),
      0
    );
  }
setActiveTab(tab: string) {
  this.activeTab = tab;
}
incSplit() { 
  this.splitBy++;
 }
decSplit() { 
  if (this.splitBy > 1) this.splitBy--; 
}
generateSplitPayments() {
  console.log(this.isSplitPayment);
  
  this.isSplitPayment=true
  this.splitRows = [];

  this.data.forEach((item: { item_total_price: number; dish_type: any; }) => {
    const splitAmount = +(item.item_total_price / this.splitBy).toFixed(2);
    let remaining = item.item_total_price;

    for (let i = 0; i < this.splitBy; i++) {
      let amount = splitAmount;

      // Fix rounding on the last row so totals match
      if (i === this.splitBy - 1) {
        amount = +(remaining).toFixed(2);
      }

      this.splitRows.push({
        status: 'Pending',
        type: item.dish_type,
        amount: amount
      });

      remaining -= splitAmount;
    }
  });
  console.log( this.splitRows);
  
}
}
