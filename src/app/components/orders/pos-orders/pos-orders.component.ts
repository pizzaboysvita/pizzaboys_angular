import { Component } from "@angular/core";
import { AgGridAngular } from "@ag-grid-community/angular";
import {
  ColDef,
  ITooltipParams,
  ModuleRegistry,
} from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AppConstants } from "../../../app.constants";
import { ApisService } from "../../../shared/services/apis.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { OrderDialogComponent } from "../order-dialog/order-dialog.component"; // 👈 Import your dialog component

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
  status: string;
  address: string;
  store_name: string;
}

interface OrderData {
  orderNumber: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  placed: string;
  due: string;
  estReadyTime: string;
  lastUpdated: string;
  status: string;
  dishes: {
    qty: number;
    item: string;
    price: number;
    mods?: string[];
    remove?: string[];
    notes?: string;
  }[];
  payments: {
    cartTotal: number;
    cardFee: number;
    gst: number;
    total: number;
    method: string;
  };
  log: {
    description: string;
    timestamp: string;
  }[];
}
@Component({
  selector: "app-pos-orders",
  imports: [AgGridAngular],
  templateUrl: "./pos-orders.component.html",
  styleUrl: "./pos-orders.component.scss",
})
export class PosOrdersComponent {
  gridOptions = {
    pagination: true,
    rowHeight: 60,
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
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "user_email",
      headerName: "Email-Id",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      field: 'phone_number',
      headerName: 'Due',
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
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
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },

   {
  headerName: 'Status',
  field: 'order_status',
  cellRenderer: (params: any) => {
    const select = document.createElement('select');
    select.className = 'custom-select';


        const options = ["Active", "Inactive", "Pending"];
        const selected = params.value || "";

        options.forEach((opt) => {
          const option = document.createElement("option");
          option.value = opt;
          option.text = opt;
          if (opt === selected) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        const rowData = params.data;
        // Handle the change event
        select.addEventListener("change", (event) => {
          const newValue = (event.target as HTMLSelectElement).value;
          params.setValue(newValue); // Updates the grid's value
          console.log("Dropdown changed to:", newValue);
          console.log(rowData, "rowData");
        });

        return select;
      },
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
      headerName: "Actions",
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
  staff_list: any;
  staffListSorting: any;
  //  onCellClicked(event: any): void {
  // let target = event.event?.target as HTMLElement;
  //  }
  constructor(
    private apiService: ApisService,
    private sessionStorage: SessionStorageService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getStaffList();
  }


   
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


  onCellClicked(event: any): void {
    const isActionColumn = event.colDef.headerName === "Actions";
    if (isActionColumn) {
      return;
    }
    if (event.node.data) {
      const mockOrderData: OrderData = {
        orderNumber: 4800,
        name: event.node.data.fullname,
        email: event.node.data.user_email,
        phone: event.node.data.phone_number.toString(),
        type: "Pickup",
        placed: "22/08/2025 at 05:14 pm",
        due: "Now / ASAP",
        estReadyTime: "22/08/2025 at 05:35 pm",
        lastUpdated: "10 minutes",
        status: "Complete",
        dishes: [
          {
            qty: 1,
            item: "Classic Cheese Pizza",
            price: 13.89,
            mods: ["Large (+4.00)", "Hollandaise Sauce (+$0.90)"],
            remove: ["Tomato Base"],
            notes: "BBQ base sauce please",
          },
          {
            qty: 1,
            item: "Banana & Caramel Pizza",
            price: 8.99,
            mods: ["Small (-$4.00)"],
          },
        ],
        payments: {
          cartTotal: 22.88,
          cardFee: 0.96,
          gst: 3.11,
          total: 23.84,
          method: "Stripe (Successful)",
        },
        log: [
          {
            description:
              'Print request sent to printer "Online Ordering - Customer"',
            timestamp: "22/08/2025 at 05:14 pm",
          },
          {
            description: 'Status updated from "Confirmed" to "Ready"',
            timestamp: "22/08/2025 at 05:35 pm",
          },
          {
            description: 'Status updated from "Ready" to "Complete"',
            timestamp: "22/08/2025 at 05:45 pm",
          },
        ],
      };
      const modalRef = this.modalService.open(OrderDialogComponent, {
        size: "md",
        centered: true,
      });
      modalRef.componentInstance.data = mockOrderData;
    }
  }
  getStaffList() {
    this.apiService
      .getApi(AppConstants.api_end_points.staff + "?user_id=-1")
      .subscribe((data: any) => {
        if (data) {
          data.data.forEach((element: any) => {
            // element.option=''
            (element.user_image = null),
              (element.fullname = element.first_name + " " + element.last_name);
            element.status =
              element.status == 1
                ? "Active"
                : element.status == 0
                ? "Inactive"
                : "";
          });
          this.staff_list = data.data;
          this.staffListSorting = data.data;
        }
      });
  }
}
