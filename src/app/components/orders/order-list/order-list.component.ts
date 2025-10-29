import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardComponent } from "../../../shared/components/card/card.component";
import { TableConfig } from "../../../shared/interface/table.interface";
import { TableComponent } from "../../widgets/table/table.component";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";

import { AgGridAngular } from "@ag-grid-community/angular";
import {
  ColDef,
  ITooltipParams,
  ModuleRegistry,
} from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AppConstants } from "../../../app.constants";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderDialogComponent } from "../order-dialog/order-dialog.component";
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  user_email: string;
  profiles: string;
  phone_number: number;
  fullname: string;
  status: string;
  address: string;
  store_name: string;
  // order_type: string;
  is_pos_order:any
  order_master_id: string;
  email: string;
  order_due_datetime: string;
  due: string;
  total_price: string;
  total_quantity: string;
  payment_method: string;
  order_status: string;
  actions?: string;
}
@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrl: "./order-list.component.scss",
  imports: [CardComponent, RouterModule, AgGridAngular],
})
export class OrderListComponent {
  gridOptions = {
    pagination: true,
    rowHeight: 60,
    context: { componentParent: this },
  };
  orderSummaryCards = [
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-2.png",
      label: "Total Orders",
      count: 80,
    },
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-3.png",
      label: "Cancelled",
      count: 21,
    },
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-1.png",
      label: "Confirm",
      count: 78,
    },
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-4.png",
      label: "Preparing",
      count: 48,
    },
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-5.png",
      label: "Ready For Delivery",
      count: 42,
    },
    {
      icon: "https://cdn-icons-png.freepik.com/512/7541/7541708.png",
      label: "Order On Its Way",
      count: 20,
    },
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-8.png",
      label: "Pending Orders",
      count: 30,
    },
    {
      icon: "https://foxpixel.vercel.app/metor/assets/images/food-icon/i-9.png",
      label: "Delivered Order",
      count: 25,
    },
  ];

  tableConfig: ColDef<RowData>[] = [
    {
      field: "is_pos_order",
      headerName: "Type",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      cellRenderer: (params: any): any => {
        const orderType = params.value;

        const backgroundColor = "rgb(81, 163, 81)";

        // If order_type = 1 → POS circle with badge
      //   if (orderType == 1) {
      //     return `
      //    <div class="d-flex align-items-center gap-2 position-relative">
      //      <div class="rounded-circle d-flex align-items-center justify-content-center"
      //           style="width: 40px; height: 40px; background-color: ${backgroundColor}; color: white; font-weight: bold;">
      //         <i class="ri-shopping-bag-2-line"></i>
      //      </div>
           
      //      <span class="badge bg-primary position-absolute"
      //            style="    width: 30px; height: 20px; top: 25px; left: 25px; font-size: 0.65rem;">POS</span>
      //    </div>
      //  `;
      //   }
       if (orderType == 1) {
          return `
         <div class="d-flex align-items-center gap-2 position-relative">
           <div class="rounded-circle d-flex align-items-center justify-content-center"
                style="width: 40px; height: 40px; background-color: ${backgroundColor}; color: white; font-weight: bold;">
              <i class="ri-shopping-bag-line"  style=" font-size: 18px;"></i>
           </div>
           
           <span class="badge bg-primary position-absolute"
                 style="    width: 30px; height: 20px; top: 25px; left: 25px; font-size: 0.65rem;">POS</span>
         </div>
       `;
        }
        else if(orderType == 0){
           return `
         <div class="d-flex align-items-center gap-2 position-relative">
           <div class="rounded-circle d-flex align-items-center justify-content-center"
                style="width: 40px; height: 40px; background-color: ${backgroundColor}; color: white; font-weight: bold;">
              <i class="ri-shopping-bag-line"></i>
           </div>
            <span class="badge bg-primary position-absolute"
                 style="    width: 30px; height: 20px; top: 25px; left: 25px; font-size: 0.65rem;">Web</span>
         </div>
           
          
       `;
        }
          else {
           return `
         <div class="d-flex align-items-center gap-2 position-relative">
           <div class="rounded-circle d-flex align-items-center justify-content-center"
                style="width: 40px; height: 40px; background-color: ${backgroundColor}; color: white; font-weight: bold;">
              <i class="ri-shopping-bag-line"></i>
           </div>
            <span class="badge bg-primary position-absolute"
                 style="    width: 30px; height: 20px; top: 25px; left: 25px; font-size: 0.65rem;">App</span>
         </div>
           
          
       `;
        }
      },
    },
    {
      field: "order_master_id",
      headerName: "#/Name",
      suppressHeaderMenuButton: true, // updated from deprecated `suppressMenu`
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
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
    },
    {
      field: "phone_number",
      headerName: "Phone",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "email",
      headerName: "Email-Id",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "order_due_datetime",
      headerName: "Due",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "due",
      headerName: "Placed",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "total_price",
      headerName: "Total",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },

    {
      field: "total_quantity",
      headerName: "#Items",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "payment_method",
      headerName: "Payment",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },

    {
      headerName: "Status",
      field: "order_status",
      cellRenderer: (params: any) => {
        const select = document.createElement("select");
        select.className = "custom-select";

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
   
    {
      headerName: "Actions",
      minWidth: 140,
      cellRenderer: (params: any) => {
        // container
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.gap = "6px";

        // Print button
        const printBtn = document.createElement("button");
        printBtn.className = "btn btn-sm btn-outline-primary";
        printBtn.textContent = "Print";

        printBtn.addEventListener("click", () => {
          params.context.componentParent.onPrintClicked(params.data);
        });

        container.appendChild(printBtn);
        return container;
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
    // {
    //   headerName: "Actions",
    //   cellRenderer: (params: any) => {
    //     return `
    //     <div style="display: flex; align-items: center; gap:15px">
    //       <button class="btn btn-sm p-0" data-action="view" title="View">
    //         <span class="material-symbols-outlined text-warning">
    //           visibility
    //         </span>
    //       </button>
    //       <button class="btn btn-sm p-0" data-action="edit" title="Edit">
    //         <span class="material-symbols-outlined text-success">
    //           edit
    //         </span>
    //       </button>
    //       <button class="btn btn-sm p-0" data-action="delete" title="Delete">
    //         <span class="material-symbols-outlined text-danger">
    //           delete
    //         </span>
    //       </button>
    //     </div>`;
    //   },
    //   minWidth: 150,
    //   flex: 1,
    // },
  ];

  categoriesList: any;
  staff_list: any;
  staffListSorting: any;
  orderDetails: any;
  modalRef: any;
  orderList: any;
  constructor(
    private apiService: ApisService,
    private sessionStorage: SessionStorageService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getOrderList();
  }
  getOrderList() {
    const store_id = JSON.parse(
      this.sessionStorage.getsessionStorage("loginDetails") as any
    ).user.store_id;
    this.apiService
      .getApi(
        AppConstants.api_end_points.orderList +
          "?store_id=" +
          store_id +
          "&type=web"
      )
      .subscribe((data: any) => {
        if (data) {
          data.categories.forEach((element: any) => {
            element.due = this.transform(element.order_created_datetime);
            // element.order_master_id = "P-" + element.order_master_id;
               if (element.is_pos_order === 1) {
            element.order_master_id = "P-" + element.order_master_id;
          } else {
            element.order_master_id = element.order_master_id; // keep as is
          }
          });
          this.orderList = data.categories;
          console.log(data, "order list data");
        }
      });
  }
  onPrintClicked(rowData: any) {
    console.log("Print clicked for:", rowData);

    this.modalRef = this.modalService.open(OrderDialogComponent, {
      size: "md",
      centered: true,
    });

    this.modalRef.componentInstance.data = rowData;
  }

  onCellClicked(event: any): void {
    console.log("PPPPPPPPPPPPPPpppnnnnnnnnnnnnnnnn", event.data);
    // if (event.node.data) {
    this.apiService
      .getApi(
        AppConstants.api_end_points.orderList + "?order_id=" + 24 + "&type=web"
      )
      .subscribe((response: any) => {
        console.log(response, "order details");
        if (response.code == 1) {
          this.orderDetails = response.categories[0];
          this.modalRef = this.modalService.open(OrderDialogComponent, {
            size: "md",
            centered: true,
          });
          this.modalRef.componentInstance.data = this.orderDetails;
        }
      });

    // }
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
  transform(value: string | Date): string {
    if (!value) return "";

    const created = new Date(value).getTime();
    const now = Date.now();
    const diffMs = now - created;

    const diffMin = Math.floor(diffMs / 60000); // ms → minutes
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 60) {
      return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
    } else if (diffHr < 24) {
      return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    }
  }
}
