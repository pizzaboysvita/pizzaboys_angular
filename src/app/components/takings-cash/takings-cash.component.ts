import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, ITooltipParams } from '@ag-grid-community/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-takings-cash',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,AgGridAngular],
  templateUrl: './takings-cash.component.html',
  styleUrl: './takings-cash.component.scss'
})
export class TakingsCashComponent {
     constructor(public modal: NgbModal,public router: Router) { }
  
sessionStart = "17/11, 10:04 pm";
activeTab = "end";
CashactiveTab = "exactAmt";

// Table rows
// takingsRows = [
//   { type: "Cash", sales: "$0.00", refunds: "$0.00", cashout: "$0.00", expected: 160, counted: 0, variance: -160 },
//   { type: "EFTPOS", sales: "$0.00", refunds: "$0.00", cashout: "$0.00", expected: 0, counted: 0, variance: 0 },
//   { type: "Voucher", sales: "$0.00", refunds: "-", cashout: "-", expected: 0, counted: 0, variance: 0 },
// ];
  sortColumn: string = "";
  sortDirection: "asc" | "desc" = "asc";
   editModal=false
  gridOptions = {
    pagination: true,
    rowHeight: 60
  };
historyRows = [
  { number: 563, ended: "CURRENT", current: true },
  { number: 562, ended: "17/11/2025 10:04 pm", current: false },
  { number: 561, ended: "16/11/2025 09:53 pm", current: false },
  { number: 560, ended: "15/11/2025 09:47 pm", current: false },
  { number: 559, ended: "14/11/2025 09:47 pm", current: false },
];
   tableConfig: ColDef<any>[] = [{
      field: 'number',
      headerName: 'Takings #',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'ended',
      headerName: 'Session Ended',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    }]
    cashCountRows: any[] = [
      {
      unit:"$0.00",
      quantity:'1',
      total:'$000'
      },
        {
      unit:"$0.00",
      quantity:'2',
      total:'$000'
      },
        {
      unit:"$0.00",
      quantity:'3',
      total:'$000'
      },
        {
      unit:"$0.00",
      quantity:'4',
      total:'$000'
      },

    ]
takingsRows: any[] = [
  {
    type: "Cash",
    sales: 0,
    refunds: 0,
    cashout: 0,
    expected: 160,
    counted: 0,
    variance: -160,
    editable: true
  },
  {
    type: "EFTPOS",
    sales: 0,
    refunds: 0,
    cashout: 0,
    expected: 0,
    counted: null,
    variance: null,
    editable: false
  },
  {
    type: "Voucher",
    sales: 0,
    refunds: null,
    cashout: null,
    expected: 0,
    counted: null,
    variance: null,
    editable: false
  }
];


calculateVariance(row: any) {
  row.variance = row.counted - row.expected;
}
updateVariance(row: any) {
  // if (!row.editable) return;

  // const counted = row.counted || 0;
  // const expected = row.expected || 0;

  // row.variance = counted - expected;
}
amount: number = 0;
// countType = 'exact';
cashCount=false
keys = ['7','8','9','4','5','6','1','2','3','0','00'];
countType: 'exact' | 'denoms' = 'exact';
cashpaymentAmount = 0;

handleKeyPress(key: string) {
  if (key === '←') {
    this.cashpaymentAmount = Math.floor(this.cashpaymentAmount / 10);
    return;
  }

  this.cashpaymentAmount = Number(String(this.cashpaymentAmount) + key);
}

setCashQuick(value: number) {
  this.cashpaymentAmount = value;
}

closeCashCount() {
  this.cashCount = false;
}

submitCash() {
  console.log('Cash counted:', this.cashpaymentAmount);
  this.cashCount = false;
}
enableEdit(row:any){
this.cashCount=true;
}
displayValue: string = "0";

press(val: string) {
  if (this.displayValue === "0") this.displayValue = "";
  this.displayValue += val;
}
}
