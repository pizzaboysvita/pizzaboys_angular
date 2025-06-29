import {
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { TableConfig } from "../../../shared/interface/table.interface";
import { staffList } from "../../../shared/data/products";
import { CardComponent } from "../../../shared/components/card/card.component";
import { TableComponent } from "../../widgets/table/table.component";
import { Router } from "@angular/router";
import { AppConstants } from "../../../app.constants";
import { CommonModule } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface RowData {
  email: string;
  profiles: string;
  phone_number: number;
  fullname: string;
  status: string
  address: string
}

@Component({
  selector: 'app-staff-list',
  imports: [CardComponent, CommonModule, AgGridAngular],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StaffListComponent {
  @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  staff_list: any;
  sortColumn: string = "";
  sortDirection: "asc" | "desc" = "asc";

  gridOptions = {
    pagination: true,
    rowHeight: 60
  };
  modules = [ClientSideRowModelModule];

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
      field: 'email',
      headerName: 'Email-Id',
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        let statusClass = '';
        if (params.value === 'Active') {
          statusClass = 'status-active';
        } else if (params.value === 'Inactive') {
          statusClass = 'status-no-stock';
        } else if (params.value === 'Pending') {
          statusClass = 'status-hide';
        }
        if (params.value === '') {
          return `
              <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                 <option value="">Select Status</option>
                 <option value="Active">Active</option>
                 <option value="Inactive">Inactive</option>
                 <option value="Pending">Pending</option>
              </select>`;
        }
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Active', 'Inactive', 'Pending'], // List of values for the dropdown
      },
      suppressMenu: true,
      unSortIcon: true,
    },
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

  staffData: any;
  constructor(private router: Router, private apis: ApisService, private modalService: NgbModal, private session: SessionStorageService) {

    this.getStaffList()
  }

  stausList = ['Active', 'In-Active']

  getStaffList() {

    this.apis.getApi(AppConstants.api_end_points.staff).subscribe((data: any) => {
      if (data) {
        data.forEach((element: any) => {
          // element.option=''
          element.user_image = null,
            element.fullname = element.first_name + ' ' + element.last_name
          element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : ''
        })
        this.staff_list = data

      }
    })
  }
  openNew() {
    this.router.navigate(["/staff/add-staff"]);

  }
  getColorForName(name: string): string {
    if (!name) return '#6c757d'; // default fallback

    // Hash the name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to HSL color
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 50%)`;
  }
  delete(data: any) {
    this.staffData = data;
    this.openConfirmPopup();
  }
  onSort(columnKey: any): void {
    if (columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }

    // Optionally trigger actual sorting of data here
  }
  // delete(data: any) {
  //   this.staffData = data
  //   this.openConfirmPopup()

  //   const action = target?.getAttribute("data-action");
  //   const staffId = event.data?.user_id;

  //   if (!action || !staffId) return;

  //   if (action === "view") {
  //     this.router.navigate([`/staff/view/${staffId}`]);
  //   } else if (action === "edit") {
  //     this.router.navigate([`/staff/edit/${staffId}`]);
  //   } else if (action === "delete") {
  //     this.delete(event.data);
  //   }
  // }
    onCellClicked(event: any): void {
     let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.getAttribute("data-action");
     const staffId = event.data?.user_id;
    console.log(action,staffId)
           if (action === "view") {
      this.router.navigate([`/staff/view/${staffId}`]);
    } else if (action === "edit") {
      this.router.navigate([`/staff/edit/${staffId}`]);
    } else if (action === "delete") {
      this.delete(event.data);
    }
    }
  openConfirmPopup() {
    this.modalService.open(this.confirmModalRef, {
      centered: true,
      backdrop: 'static'
    });
  }
  onConfirm(modal: any) {
    // modal.close();
    // Perform your confirm logic here
    const req_body = {
      "staff_id": this.staffData.staff_id
    }
    this.apis.deleteApi(AppConstants.api_end_points.staff).subscribe((data: any) => {

      if (data) {
        console.log(data)
        modal.close();
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          width: '350px',  // customize width (default ~ 600px)
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('User clicked OK');
            this.getStaffList();
          }
        });

      }
    })
  }
}
