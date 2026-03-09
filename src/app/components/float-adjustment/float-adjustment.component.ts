import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApisService } from '../../shared/services/apis.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { AppConstants } from '../../app.constants';
import Swal from 'sweetalert2';
import { ColDef } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-float-adjustment',
  imports: [CommonModule,ReactiveFormsModule,AgGridAngular,NgSelectModule],
  templateUrl: './float-adjustment.component.html',
  styleUrl: './float-adjustment.component.scss',
  providers: [DatePipe] 
})
export class FloatAdjustmentComponent {
  today: string | null;
  storeId: any;
    rowData: any[] = [];
  floatAmount: number = 0;
  cashInTill: number = 0;

  columnDefs: ColDef[] = [
    { headerName: 'Type', field: 'Type',width: 150 },

    {
      headerName: 'Sales',
      field: 'Sales',
      width: 140,
      valueFormatter: params => this.currencyFormatter(params.value)
    },
    {
      headerName: 'Refunds',
      field: 'Refunds',
      width: 140,

      valueFormatter: params => this.currencyFormatter(params.value)
    },
    {
      headerName: 'Cashout',
      field: 'Cashout',
      width: 140,

      valueFormatter: params => this.currencyFormatter(params.value)
    },
    {
      headerName: 'Expected',
      width: 140,
      field: 'Expected',
      valueFormatter: params => this.currencyFormatter(params.value)
    },
    {
      headerName: 'Counted',
      field: 'Counted',
      width: 140,
      valueFormatter: params => params.value ?? '-'
    },
    {
      headerName: 'Variance',
      width: 140,
      field: 'Variance'
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100
  };

   constructor(public modal: NgbModal,public router: Router,private apiService: ApisService,
    private sessionStorageService: SessionStorageService,private datePipe: DatePipe,
    private fb:FormBuilder,private CommonService:CommonService) { }
activeTab = 'create';
sourceOptions = [
  { value: 'FLOAT', label: 'Float Cash' },
  { value: 'PETTY', label: 'Petty Cash' },
  { value: 'CLEARING', label: 'Clearing Cash' }
];
destinationOptions:any = [];
paymentForm: FormGroup
  ngOnInit() {
    this.paymentForm = this.fb.group({
  amount: [null, [Validators.required]],
  source: [null, Validators.required],
  destination: [null],
  notes: ['']
});

     this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const user = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any).user;
       this.storeId = user.store_id;
   this.getCashflow();
  }

updateValues() {
  this.CommonService.setFloat(this.floatAmount);
  this.CommonService.setCash(this.cashInTill);
}
getCashflow() {
  const params = `?store_id=${this.storeId}&cash_flow_date=${this.today}`;

  this.apiService
    .getApi(AppConstants.api_end_points.cashflow + params)
    .subscribe((res: any) => {
      if (res.code === '1') {
        this.rowData = res.cashFlowDetails;

        const summary = this.rowData.find((x: any) => x.Type === 'SUMMARY');
        const nonSummary = this.rowData.filter((x: any) => x.Type == 'Cash');

        // Float = SUMMARY Expected
        this.floatAmount = Number(summary?.Expected ?? 0);

        // Remaining Sales (excluding SUMMARY)
        const remainingSales = nonSummary.reduce(
          (sum: number, item: any) => sum + Number(item.Sales ?? 0),
          0
        );

        // Cash in till = Float + Remaining Sales
        this.cashInTill = this.floatAmount + remainingSales;
        this.updateValues();
      } else {
        alert(res.message || 'Failed to load cash flow');
      }
    });
}

   currencyFormatter(value: number) {
    if (value == null) return '0.00';
    return `₹ ${value.toFixed(2)}`;
  }
updateDestinationOptions() {
  const src = this.paymentForm.get('source')?.value;
  // If no source selected, show empty list
  if (!src) {
    this.destinationOptions = [];
    return;
  }

  this.destinationOptions = this.sourceOptions.filter(x => x.value !== src);
}
createCashflow(){
        if (this.paymentForm.invalid) {
          this.paymentForm.markAllAsTouched();
          return;
        }
       const payload = {
        // payment_type
      "store_id":this.storeId,
      "flow_type": this.paymentForm.value.source,
      "amount": this.paymentForm.value.amount,
      "cash_flow_date": this.today,
      "created_by": JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.user_id,
    }
    
           this.apiService.postApi(AppConstants.api_end_points.cashflow, payload).subscribe((res: any) => {
                  if (res.code === "1") {
                    Swal.fire("Success!", res.message, "success").then((result) => {
                      if (result) {
                        console.log("User clicked OK");
                        this.getCashflow();
                        this.modal.dismissAll();
          
                      }
                    });
                    // this.modal.dismissAll("refresh");
                  } else {
                    alert(res.message || "Failed to add Dish");
                  }
                });
}

}
