import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from '../../../shared/services/session-storage.service';

@Component({
  selector: 'app-order-payments',
  imports: [CommonModule,NgbNavModule],
  templateUrl: './order-payments.component.html',
  styleUrl: './order-payments.component.scss'
})
export class OrderPaymentsComponent {
  @Input() data: any;
  @Input() customer: any;
isLoading = false;
progressValue = 10;
  splitBy = 2;
  splitRows: any;
  isSplitPayment: boolean=false;
  activeTab: string = 'full'; // default tab
  // activeTab: 'full' | 'items' | 'people' = 'full';
  // totalPrice: number;
  unpaidItems: any;
  payItems: any[] = [];     // selected items waiting for payment
  paidItems: any[] = [];    // confirmed paid items
  isModalOpen: boolean=true;
  showPopup: boolean=true;
  confirmRemove = false;
  showEftModal=false
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
  tenderedAmount: number=0;
  showChangeModal = false;
  changeAmount = 0;
  orderList: any=[];
  totalPaid: any;
  payload: { };
  order_payments_json: any=[];
  paymentType: any;
  itemsJson: any=[];
  isVoucherConfirm = false;
  paymentAmountStr: string;
 constructor(public modal: NgbModal,private cdr: ChangeDetectorRef,public activeModal: NgbActiveModal, private sessionStorageService: SessionStorageService) {}
  ngOnInit(): void {
    this.payItems=[]
    this.paidItems= [];    // confirmed paid items
    this.unpaidItems=this.data
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
    amount: this.totalPrice,
    tender:'-',
    change:'-'
  });
  }
setActiveTab(tab: string) {
  this.activeTab = tab;
  if(this.activeTab =='people' ||   this.activeTab =='items'){
  this.splitCash=true
 // ✅ Keep only 'Success' rows in fullArray
    const successfulRows = this.fullArray.filter((row: { status: string; }) => row.status === 'Success');
    this.fullArray = successfulRows.length > 0 ? successfulRows : [];

    // ✅ If empty, reset remaining & paymentAmount to totalPrice
    if (this.fullArray.length === 0) {
      this.remaining = this.totalPrice;
      this.paymentAmount = this.totalPrice;
    }
  }
    if(this.activeTab =='full' ||   this.activeTab =='items'){
    this.isSplitPayment = false;

   const splitfulRows = this.splitRows.filter((row: { status: string; }) => row.status === 'Success');
    this.splitRows = splitfulRows.length > 0 ? splitfulRows : [];
    }
     if(this.activeTab =='full' ||   this.activeTab =='people'){
    this.isSplitPayment = false;
   const splitfulRows = this.paidItems.filter((row: { status: string; }) => row.status === 'Success');
    this.paidItems = splitfulRows.length > 0 ? splitfulRows : [] ;
    if (!splitfulRows.length) this.unpaidItems = this.data;
    }
}
incSplit() { 
  this.splitBy++;
 }
decSplit() { 
  if (this.splitBy > 1) this.splitBy--; 
}
allPaymentsSuccessful(): boolean {
  return this.fullArray.length > 0 && this.fullArray.every((item: { status: string; }) => item.status === 'Success');
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
    amount: amount,
    tender:'-',
    change:'-'
  });

  remaining -= splitAmount;
}
// this.fullArray=this.splitRows
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
  // this.paidItems.push(...this.payItems);  
  this.paidItems.push(
  ...this.payItems.map(item => ({
    ...item,
    status: 'Pending',
    type: 'New'
  }))
);
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
// appendNumber(num: any) {
//   this.paymentAmount=0
//   this.paymentAmount = Number(String(this.paymentAmount) + String(num));
//   this.remaining = this.totalPrice - this.paymentAmount;
// }
appendNumber(num: any) {
  // Initialize string if undefined
  if (!this.paymentAmountStr) {
    this.paymentAmountStr = '';
  }

  // Prevent multiple leading zeros (optional)
  if (this.paymentAmountStr === '' && (num === 0 || num === '00')) {
    return;
  }

  // Append the number pressed
  this.paymentAmountStr += String(num);

  // Convert to number safely
  this.paymentAmount = Number(this.paymentAmountStr) || 0;

  // Update remaining
  // this.remaining = this.totalPrice - this.paymentAmount;
  // this.remaining = this.remaining - this.paymentAmount;

}

clearAmount() {
   this.paymentAmountStr = '';
  this.paymentAmount = 0;
  this.remaining = this.totalPrice;
}
setPayment(percent: number) {
  this.percentage=percent
  this.paymentAmount = (this.remaining * percent) / 100;
    // this.remaining = this.totalPrice - this.paymentAmount;
    
    this.remaining = this.remaining - this.paymentAmount;
}
get isFullyPaid(): boolean {
  const totalPaid = this.fullArray?.reduce((sum: any, p: { amount: any; }) => sum + (p.amount || 0), 0);
  return totalPaid >= this.totalPrice;
}
fullAddPayment() {
  if (!this.paymentAmount || this.paymentAmount <= 0) {
    return; 
  }
  const newRow = {
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
  this.paymentAmountStr = '';
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

openCashModal(type:any) {
  this.paymentType=type
  console.log(type);
  
    if (!this.selectedRowData) return; // no row selected
  this.cashpaymentAmount = this.selectedRowData.amount; 
  if(this.activeTab=='items'){
      this.cashpaymentAmount = this.selectedRowData.item_total_price; 
    }
  if(type == 'Cash'){
  this.showNewModelPopup=true
  }
  else if(type=='EFTPOS'){
       this.showEftModal=true
       this.isLoading = true;
         setTimeout(() => {
    this.isLoading = false;
  }, 2000);
  }
  else{
    this.confirmCashPayment()
  }
}
setCashQuick(amount: number) {
   this.tenderedAmount  = amount;
}
appendCashNumber(num: any) {
  this.cashpaymentAmount = Number(this.paymentAmount.toString() + num.toString());
}

clearCashAmount() {
  this.cashpaymentAmount = 0;
}
// Confirm payment
confirmCashPayment() {
  console.log('asjgasgd');

 if (this.selectedRowIndex === null) return;
  if (this.tenderedAmount > this.cashpaymentAmount) {
    this.changeAmount = +(this.tenderedAmount - this.cashpaymentAmount).toFixed(2);
  }
//   if (this.remainingAmount <= 0) {
//   this.showChangeModal = true;   // ✅ open the summary modal
// }
    // this.showChangeModal = true;
    //  this.showNewModelPopup = false;

if(this.activeTab=='full'){
  // Update the selected row
  this.fullArray[this.selectedRowIndex].status = 'Success';
  this.fullArray[this.selectedRowIndex].type =  this.paymentType;
  this.fullArray[this.selectedRowIndex].amount = this.cashpaymentAmount;
  this.fullArray[this.selectedRowIndex].tender = this.tenderedAmount;
  this.fullArray[this.selectedRowIndex].change = this.changeAmount;

  this.percentageJson.push({
    "amount": this.cashpaymentAmount,
    "percentage": this.percentage,
    "user_name": this.customer.name,
    "status": 1
  })

  this.totalPaid = this.fullArray
    .filter((x: { status: string; }) => x.status === 'Success')
    .reduce((sum: any, row: { amount: any; }) => sum + row.amount, 0);
    
  }
else if(this.activeTab =='people'){
  this.splitRows[this.selectedRowIndex].status = 'Success';
  this.splitRows[this.selectedRowIndex].type =   this.paymentType;
  this.splitRows[this.selectedRowIndex].amount = this.cashpaymentAmount;
  this.splitRows[this.selectedRowIndex].tender = this.tenderedAmount;
  this.splitRows[this.selectedRowIndex].change = this.changeAmount;
  console.log(this.percentageJson,"asasdsad");
    this.userJson.push({
    "amount": this.cashpaymentAmount,
    "user_id": 201,
    "user_name": this.customer.name
  })
  //   this.payload = {
  //   payment_split_percentage_json: [],
  //   payment_split_users_json:this.userJson,
  //   payment_split_items_json: []
  // };
  // console.log(this.payload);
}
else if(this.activeTab =='items'){
  this.paidItems[this.selectedRowIndex].status = 'Success';
  this.paidItems[this.selectedRowIndex].type =   this.paymentType;
  this.paidItems[this.selectedRowIndex].amount = this.cashpaymentAmount;
  this.paidItems[this.selectedRowIndex].tender = this.tenderedAmount;
  this.paidItems[this.selectedRowIndex].change = this.changeAmount;
  console.log(this.percentageJson,"asasdsad");
    this.itemsJson.push({
      "dish_id": this.selectedRowData?.dish_id,
      "user_id": 201,
      "user_name": this.customer.name,
      "percentage":this.percentage,
      "amount":  this.cashpaymentAmount
//     },
  })

}
  this.showNewModelPopup = false;
 if (this.activeTab === 'full' && this.checkAllPaymentsSuccess()) {
    this.collectSuccessfulPayments();
    this.showChangeModal = true;   // open summary modal
  }
  else if (this.activeTab === 'people' && this.checkAllPeoplePaymentsSuccess()) {
    this.collectPeopleSuccessfulPayments();
    this.showChangeModal = true;   // open summary modal
  }
    else if (this.activeTab === 'items' && this.checkAllItemsPaymentsSuccess()) {
    this.collectItemsSuccessfulPayments();
    this.showChangeModal = true;   // open summary modal
  }
  this.selectedRowIndex = null;
  this.selectedRowData = null;
  this.showEftModal=false
  // this.cashpaymentAmount = 0;
}
 collectSuccessfulPayments() {
  this.orderList = this.fullArray.filter((r: { status: string; }) => r.status === 'Success');
  this.totalPaid = this.orderList.reduce((s: number, r: { amount: any; }) => s + (Number(r.amount) || 0), 0);
}
checkAllPaymentsSuccess(): boolean {
  if (!this.fullArray.length) return false;
  const allSuccess = this.fullArray.every((r: any) => r.status === 'Success');
  const successTotal = this.fullArray
    .filter((r: any) => r.status === 'Success')
    .reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
  return allSuccess && successTotal === this.totalPrice;
}
 collectPeopleSuccessfulPayments() {
  this.orderList = this.splitRows.filter((r: { status: string; }) => r.status === 'Success');
  this.totalPaid = this.orderList.reduce((s: number, r: { amount: any; }) => s + (Number(r.amount) || 0), 0);
}
checkAllPeoplePaymentsSuccess(): boolean {
  if (!this.splitRows.length) return false;
  const allSuccess = this.splitRows.every((r: any) => r.status === 'Success');
  const successTotal = this.splitRows
    .filter((r: any) => r.status === 'Success')
    .reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
  return allSuccess && successTotal === this.totalPrice;
}
 collectItemsSuccessfulPayments() {
  this.orderList = this.paidItems.filter((r: { status: string; }) => r.status === 'Success');
  this.totalPaid = this.orderList.reduce((s: number, r: { amount: any; }) => s + (Number(r.amount) || 0), 0);
}
checkAllItemsPaymentsSuccess(): boolean {
  if (!this.paidItems.length) return false;
  const allSuccess = this.paidItems.every((r: any) => r.status === 'Success');
  const successTotal = this.paidItems
    .filter((r: any) => r.status === 'Success')
    .reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
  return allSuccess && successTotal === this.totalPrice;
}
  closeOrdersModal(){
    this.showChangeModal=false
    this.showNewModelPopup = false;
      const newPayments = this.fullArray
  .filter((x: any) => x.status === 'Success')
  .map((x: any) => ({
    payment_method: x.type,
    payment_status: 'Completed',
    amount: +x.amount,
    payment_created_by:  JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user.user_id
  }));

// ✅ Push each new payment to the existing array
this.order_payments_json.push(...newPayments);
     this.payload = {
    payment_split_percentage_json: this.percentageJson,
    payment_split_users_json: this.userJson,
    payment_split_items_json: this.itemsJson,
    order_payments_json:this.order_payments_json,
  };
    this.activeModal.close(this.payload);
  }

handleVoucherClick() {
  if (!this.isVoucherConfirm) {
    // 🔹 First click — show confirm state
    this.isVoucherConfirm = true;
  } else {
    // 🔹 Second click — perform action and reset
    this.openCashModal('Voucher');
    this.isVoucherConfirm = false;
  }
}
}