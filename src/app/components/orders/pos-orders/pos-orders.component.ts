import { Component } from '@angular/core';
import { AgGridAngular } from "@ag-grid-community/angular";
import { ColDef, ITooltipParams, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AppConstants } from '../../../app.constants';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  order_type:string,
  order_master_id:Number,
  total_price:string,
  total_quantity:string,
  order_status:string,
  user_email: string;
  profiles: string;
  phone_number: number;
  fullname: string;
  status: string
  address: string;
  store_name:string
}
@Component({
  selector: 'app-pos-orders',
  imports: [AgGridAngular],
  templateUrl: './pos-orders.component.html',
  styleUrl: './pos-orders.component.scss'
})
export class PosOrdersComponent {
   gridOptions = {
    pagination: true,
    rowHeight: 60
  };
  tableConfig: ColDef<RowData>[] = [
    {
      field: 'order_type',
      headerName: 'Type',
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
    },

    {
      field: 'order_master_id',
      headerName: '#/Name',
      suppressHeaderMenuButton: true, // updated from deprecated `suppressMenu`
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
      // cellRenderer: (params: any) => {
      //   const firstName = params.value;
      //   const image = params.data?.profiles;
      //   const initials = firstName ? firstName.charAt(0).toUpperCase() : '?';
      //   const backgroundColor = getColorForName(firstName);

      //   if (image) {
      //     return `
      //   <div class="d-flex align-items-center gap-2">
      //     <img src="${image}" class="img-fluid rounded-circle" 
      //       style="width: 40px; height: 40px;" alt="${firstName}" />
      //     <span>${firstName}</span>
      //   </div>
      // `;
      //   } else {
      //     return `
      //   <div class="d-flex align-items-center gap-2">
      //     <div class="avatar-placeholder rounded-circle text-white d-flex align-items-center justify-content-center"
      //       style="width: 40px; height: 40px; font-weight: bold; font-size: 1rem; background-color: ${backgroundColor}">
      //       ${initials}
      //     </div>
      //     <span>${firstName}</span>
      //   </div>
      // `;
      //   }

      //   // Helper function for fallback color
      //   function getColorForName(name: string): string {
      //     const colors = ['#6c5ce7', '#00b894', '#fd79a8', '#e17055', '#0984e3'];
      //     let index = 0;
      //     if (name) {
      //       index = name.charCodeAt(0) % colors.length;
      //     }
      //     return colors[index];
      //   }
      // }
    }
    ,
 {
      field: 'store_name',
      headerName: 'Phone',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'user_email',
      headerName: 'Email-Id',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'phone_number',
      headerName: 'Due',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'address',
      headerName: 'Placed',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
     {
      field: 'total_price',
      headerName: 'Total',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
     {
      field: 'total_quantity',
      headerName: '#Items',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
   {
  headerName: 'Status',
  field: 'order_status',
  cellRenderer: (params: any) => {
    const select = document.createElement('select');
    select.className = 'custom-select';
  

    const options = ['Active', 'Inactive', 'Pending'];
    const selected = params.value || '';

    options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.text = opt;
      if (opt === selected) {
        option.selected = true;
      }
      select.appendChild(option);
    });

      const rowData = params.data;
    // Handle the change event
    select.addEventListener('change', (event) => {
      const newValue = (event.target as HTMLSelectElement).value;
      params.setValue(newValue); // Updates the grid's value
      console.log('Dropdown changed to:', newValue);
      console.log(rowData,'rowData')
    });

    return select;
  }
},


   
  ];
  staff_list: any;
  staffListSorting: any;
  orderList: any;
     onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;
     }
      constructor(private apiService:ApisService,  private sessionStorage: SessionStorageService){}
     
       ngOnInit() {
      this.getOrderList();
       }
         getOrderList() {
       
           this.apiService.getApi(AppConstants.api_end_points.orderList).subscribe((data: any) => {
             if (data) {

              this.orderList = data.categories
             console.log(data, 'order list data');
             }
           })
         }

}
