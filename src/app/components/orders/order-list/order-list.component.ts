import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';

import { AgGridAngular } from "@ag-grid-community/angular";
import { ColDef, ITooltipParams, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AppConstants } from '../../../app.constants';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  user_email: string;
  profiles: string;
  phone_number: number;
  fullname: string;
  status: string
  address: string;
  store_name:string
}
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  imports: [CardComponent, RouterModule,AgGridAngular]
})


export class OrderListComponent {

  gridOptions = {
    pagination: true,
    rowHeight: 60
  };
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

  tableConfig: ColDef<RowData>[] = [
    // {
    //   field: 'user_id',
    //   headerName: 'Staff Id',
    //   sortable: true,
    //   suppressMenu: true,
    //   unSortIcon: true,
    // },

    {
      field: 'fullname',
      headerName: 'Name',
      suppressHeaderMenuButton: true, // updated from deprecated `suppressMenu`
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
      cellRenderer: (params: any) => {
        const firstName = params.value;
        const image = params.data?.profiles;
        const initials = firstName ? firstName.charAt(0).toUpperCase() : '?';
        const backgroundColor = getColorForName(firstName);

        if (image) {
          return `
        <div class="d-flex align-items-center gap-2">
          <img src="${image}" class="img-fluid rounded-circle" 
            style="width: 40px; height: 40px;" alt="${firstName}" />
          <span>${firstName}</span>
        </div>
      `;
        } else {
          return `
        <div class="d-flex align-items-center gap-2">
          <div class="avatar-placeholder rounded-circle text-white d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px; font-weight: bold; font-size: 1rem; background-color: ${backgroundColor}">
            ${initials}
          </div>
          <span>${firstName}</span>
        </div>
      `;
        }

        // Helper function for fallback color
        function getColorForName(name: string): string {
          const colors = ['#6c5ce7', '#00b894', '#fd79a8', '#e17055', '#0984e3'];
          let index = 0;
          if (name) {
            index = name.charCodeAt(0) % colors.length;
          }
          return colors[index];
        }
      }
    }
    ,
 {
      field: 'store_name',
      headerName: 'Store Name',
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
      headerName: 'Phone Number',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'address',
      headerName: 'Address',
      suppressMenu: true,
      unSortIcon: true,
         tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
   {
  headerName: 'Status',
  field: 'status',
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

  // {
  //     headerName: "Status",
  //     field: "status",
  //     cellRenderer: (params: any) => {
  //       // let statusClass = "";
  //     let statusClass = "status-active";
  //       if (params.value == "Active") {
  //         statusClass = "status-active";
  //       } else if (params.value === "No Stock") {
  //         statusClass = "status-no-stock";
  //       } else if (params.value === "Hide") {
  //         statusClass = "status-hide";
  //       }
  //       if (params.value === "") {
  //         return `
  //           <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
  //               <option value="">Select Status</option>
  //             <option value="Active">Active</option>
  //             <option value="No Stock">No Stock</option>
  //             <option value="Hide">Hide</option>
  //           </select>
  //         `;
  //       }
  //       return `<div class="status-badge ${statusClass}"> ${ params.value}</div>`;
  //     },
  //     editable: true, 
  //     cellEditor: "agSelectCellEditor", 
  //     cellEditorParams: {
  //       values: ["Active", "No Stock", "Hide"], 
  //     },
  //     suppressMenu: true,
  //     unSortIcon: true,
  //   },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px">
          <button class="btn btn-sm p-0" data-action="view" title="View">
            <span class="material-symbols-outlined text-warning">
              visibility
            </span>
          </button>
          <button class="btn btn-sm p-0" data-action="edit" title="Edit">
            <span class="material-symbols-outlined text-success">
              edit
            </span>
          </button>
          <button class="btn btn-sm p-0" data-action="delete" title="Delete">
            <span class="material-symbols-outlined text-danger">
              delete
            </span>
          </button>
        </div>`;
      },
      minWidth: 150,
      flex: 1,
    },
  ];


  categoriesList: any;
  staff_list: any;
  staffListSorting: any;
  constructor(private apiService:ApisService,  private sessionStorage: SessionStorageService){}

  ngOnInit() {
 this.getStaffList();
  }
    getStaffList() {
  
      this.apiService.getApi(AppConstants.api_end_points.staff+"?user_id=-1").subscribe((data: any) => {
        if (data) {
  
          data.data.forEach((element: any) => {
            // element.option=''
            element.user_image = null,
              element.fullname = element.first_name + ' ' + element.last_name
            element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : ''
          })
          this.staff_list = data.data
          this.staffListSorting = data.data
        }
      })
    }
   onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
   
    const action = target?.getAttribute("data-action");
     console.log(event.data, 'target action')
    const staffId = event.data?.user_id;
    console.log(action, staffId)
    if (action === "view") {
      // this.router.navigate([`/staff/view/${staffId}`]);
    } else if (action === "edit") {
      // this.router.navigate([`/staff/edit/${staffId}`]);
    } else if (action === "delete") {
      // this.delete(event.data);
    }
  }
}