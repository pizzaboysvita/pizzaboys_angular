import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-payments',
  imports: [CommonModule,NgbNavModule],
  templateUrl: './order-payments.component.html',
  styleUrl: './order-payments.component.scss'
})
export class OrderPaymentsComponent {
  @Input() data: any;
splitBy = 2;
  splitRows: any;
  isSplitPayment: boolean=false;
  activeTab: string = 'full'; // default tab
  // totalPrice: number;
  unpaidItems: any;
 payItems: any[] = [];     // selected items waiting for payment
paidItems: any[] = [];    // confirmed paid items
  isModalOpen: boolean=true;
  showPopup: boolean=true;
  confirmRemove = false;
  paid: any;
paymentAmount: number = 0;
totalPrice: number = 0;
remaining: number = this.totalPrice;
payments: any[] = [];
  fullArray:any =[];
  splitCash: boolean;
cashModal=false
  showNewModelPopup = false;
  selectedRowIndex: number | null = null;
selectedRowData: any = null;
  cashpaymentAmount: number;
  percentageJson:any=[];
  percentage: number=0;
  userJson: any=[];

 constructor(public modal: NgbModal,private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.payItems=[]
    this.paidItems= [];    // confirmed paid items
    this.unpaidItems=this.data
    console.log(this.data);
    this.calculateTotal()
this.remaining = this.totalPrice;
this.paymentAmount =this.totalPrice;
  }
 calculateTotal(): void {
    this.totalPrice = this.data.reduce(
      (sum: number, row: { item_total_price: any; }) => sum + (Number(row.item_total_price) || 0),
      0
    );
    this.fullArray.push({
    status: 'Pending',
    type: 'New',
    amount: this.totalPrice
  });
  }
setActiveTab(tab: string) {
  this.activeTab = tab;
  if(this.activeTab=='people' ||   this.activeTab=='items'){
  this.splitCash=true
  this.fullArray=[]
  }
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
  // this.data.forEach((item: { item_total_price: number; dish_type: any; }) => {
  //   const splitAmount = +(item.item_total_price / this.splitBy).toFixed(2);
  //   let remaining = item.item_total_price;

  //   for (let i = 0; i < this.splitBy; i++) {
  //     let amount = splitAmount;

  //     // Fix rounding on the last row so totals match
  //     if (i === this.splitBy - 1) {
  //       amount = +(remaining).toFixed(2);
  //     }

  //     this.splitRows.push({
  //       status: 'Pending',
  //       type: item.dish_type,
  //       amount: amount
  //     });

  //     remaining -= splitAmount;
  //   }
  // });
 
const totalAmount = this.data.reduce(
  (sum: number, item: { item_total_price: number }) => sum + item.item_total_price,
  0
);
const splitAmount = +(totalAmount / this.splitBy).toFixed(2);
let remaining = totalAmount;
this.splitRows = []; 
for (let i = 0; i < this.splitBy; i++) {
  let amount = splitAmount;

  if (i === this.splitBy - 1) {
    amount = +remaining.toFixed(2);
  }

  this.splitRows.push({
    status: 'Pending',
    type: 'New',
    amount: amount
  });

  remaining -= splitAmount;
}
this.fullArray=this.splitRows
}
moveToPay(item: any, index: number) {
  this.payItems.push(item);
  this.unpaidItems.splice(index, 1);
}
removeToPay(item: any, index: number) {
  this.unpaidItems.push(item);
  this.payItems.splice(index, 1);
}

getUnpaidTotal() {
  return this.unpaidItems.reduce((sum: any, item: { item_total_price: any; }) => sum + item.item_total_price, 0).toFixed(2);
}

getPayTotal() {
  return this.payItems.reduce((sum, item) => sum + item.item_total_price, 0).toFixed(2);
}
addPayment() {
  console.log("this.addPayment");
  this.paidItems.push(...this.payItems);  
  console.log(this.paidItems,'paiditems');
    this.payItems = [];
  // this.totalPrice = this.paidItems.reduce((sum, i) => sum + i.price, 0);
}
closeModal() {
  this.isModalOpen = false;
}

toggleRemove() {
  this.confirmRemove = !this.confirmRemove;
  // If confirmRemove is true and clicked again → do actual remove
  if (!this.confirmRemove) {
    // Reset after cancel
    return;
  }
}

doRemove(tab: string) {
  if (tab === 'partial' || tab === 'full') {
    this.data = [];
    this.totalPrice = 0;
  }

  if (tab === 'people') {
    this.splitRows = [];
    this.splitBy = 2;         // reset split count
    this.isSplitPayment = false;
  }

  if (tab === 'items') {
    this.unpaidItems = [];
    this.payItems = [];
    this.paidItems = [];
    this.isSplitPayment = false;
  }

  // Reset confirmation
  this.confirmRemove = false;

  // Force refresh if OnPush
  this.cdr.detectChanges();
}




appendNumber(num: any) {
  this.paymentAmount=0
  this.paymentAmount = Number(String(this.paymentAmount) + String(num));
  this.remaining = this.totalPrice - this.paymentAmount;
}

clearAmount() {
  this.paymentAmount = 0;
  this.remaining = this.totalPrice;
}
setPayment(percent: number) {
  this.percentage=percent
  this.paymentAmount = (this.totalPrice * percent) / 100;
    this.remaining = this.totalPrice - this.paymentAmount;
}
fullAddPayment() {
  if (!this.paymentAmount || this.paymentAmount <= 0) {
    return; 
  }
  const newRow = {
    // status: this.paymentAmount >= this.remaining ? 'Paid' : 'Partially Paid',
    status:'Pending',
    type: 'New', 
    amount: this.paymentAmount,
    tender: '-',
    change: '-',
  };
  this.fullArray.push(newRow);
  this.remaining = this.totalPrice - this.fullArray.reduce((sum: any, row: { amount: any; }) => sum + row.amount, 0);
  // Reset entered amount
  this.paymentAmount =   this.remaining ;
}


selectRow(row: any, index: number) {
  this.selectedRowIndex = index;
  this.selectedRowData = row;
}
// Open modal
 closeNewModelPopup() {
  this.selectedRowIndex = null;
  this.selectedRowData = null;
    this.showNewModelPopup = false;
  }
openCashModal() {
    if (!this.selectedRowData) return; // no row selected

  this.cashpaymentAmount = this.selectedRowData.amount; 
  this.showNewModelPopup=true
}
setCashQuick(amount: number) {
   this.cashpaymentAmount = amount;
}

appendCashNumber(num: any) {
  this.cashpaymentAmount = Number(this.paymentAmount.toString() + num.toString());
}

clearCashAmount() {
  this.cashpaymentAmount = 0;
}

// Confirm payment
confirmCashPayment() {
 if (this.selectedRowIndex === null) return;
if(this.activeTab=='full'){
  // Update the selected row
  this.fullArray[this.selectedRowIndex].status = 'Success';
  this.fullArray[this.selectedRowIndex].type = 'Cash';
  this.fullArray[this.selectedRowIndex].amount = this.cashpaymentAmount;
  
  this.percentageJson.push({
    "amount": this.cashpaymentAmount,
    "percentage": this.percentage,
    "user_name": "User A",
    "status": 1
  })
     const payload = {
    payment_split_percentage_json: this.percentageJson,
    payment_split_users_json: [],
    payment_split_items_json: []
  };
  
  }
else if(this.activeTab =='people'){
    this.splitRows[this.selectedRowIndex].status = 'Success';
  this.splitRows[this.selectedRowIndex].type = 'Cash';
  this.splitRows[this.selectedRowIndex].amount = this.cashpaymentAmount;
  console.log(this.percentageJson,"asasdsad");
    this.userJson.push({
    "amount": this.cashpaymentAmount,
    "user_id": 201,
    "user_name": "User A"
  })
    const payload = {
    payment_split_percentage_json: [],
    payment_split_users_json:this.userJson,
    payment_split_items_json: []
  };
  console.log(payload);

}

  // Close modal
  this.showNewModelPopup = false;
  // Reset selection
  this.selectedRowIndex = null;
  this.selectedRowData = null;
  this.cashpaymentAmount = 0;
  
}
}