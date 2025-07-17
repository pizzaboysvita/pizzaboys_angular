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
import { CommonModule, DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ColDef, ITooltipParams, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import * as ExcelJS from 'exceljs';
import FileSaver from "file-saver";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  imports: [CardComponent, CommonModule,FormsModule,ReactiveFormsModule ,AgGridAngular],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss',
  encapsulation: ViewEncapsulation.None,
providers:[DatePipe]
})
export class StaffListComponent {
  @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  staff_list: any=[];
  staffForm:FormGroup
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
      field: 'email',
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

  staffData: any;
  staffListSorting: any;
  constructor(private router: Router,private datePipe:DatePipe ,private apis: ApisService, private fb:FormBuilder,private modalService: NgbModal, private session: SessionStorageService) {

    this.getStaffList()
  }
ngOnInit(){
  this.staffForm=this.fb.group({
 staffeName:[''],
      email:[''],
      address:[''],
      status:['Active']
  })
}
  stausList = ['Active', 'In-Active']

  getStaffList() {

    this.apis.getApi(AppConstants.api_end_points.staff+"?user_id=-1").subscribe((data: any) => {
      if (data) {

        data.data.forEach((element: any) => {
          // element.option=''
          element.user_image = null,
            element.fullname = element.first_name + ' ' + element.last_name
          element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : ''
        })
        this.staff_list = data.data
this.staffListSorting=data.data
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
  onChange(rowData:any){
    console.log(rowData,'rowdata')
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
    // const req_body = {
    //   "staff_id": this.staffData.staff_id
    // }
    console.log(this.staffData)
    this.apis.deleteApi(AppConstants.api_end_points.staff + '/' + this.staffData.user_id).subscribe((data: any) => {

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
  downloadDevicesExcel(): void {
    if (!this.staff_list || this.staff_list.length === 0) {
      console.warn('No data to export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Stores');

    // Define header row with styles
    const headers = [
      { header: 'User Id', key: 'user_id', width: 20 },
      { header: 'Role Id', key: 'role_id', width: 25 },
      { header: 'First Name', key: 'first_name', width: 15 },
      { header: 'Last Name', key: 'last_name', width: 30 },
      { header: 'Phone Number', key: 'phone_number', width: 20 },
      { header: 'Address', key: 'address', width: 12 },
      { header: 'City', key: 'city', width: 12 },
      { header: 'State', key: 'state', width: 12 },
      { header: 'Country', key: 'country', width: 12 },
      { header: 'Pos Code', key: 'pos_pin', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Created on', key: 'created_on', width: 12 },
      { header: 'Updated on', key: 'updated_on', width: 12 },
      { header: 'Created By', key: 'created_by', width: 12 },
      { header: 'Updated BY', key: 'updated_by', width: 12 },
      { header: 'Permissions', key: 'permissions', width: 12 },
      { header: 'Profiles', key: 'profiles', width: 12 },

    ];

    worksheet.columns = headers;

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }, // dark blue
      };
    });

    // Add data rows
    this.staff_list.forEach((store: any) => {
      worksheet.addRow({
        user_id: store.user_id || '',
        role_id: store.role_id || '',
        first_name: store.first_name || '',
        last_name: store.last_name || '',
        phone_number: store.phone_number || '',
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        country: store.country || '',
        pos_pin: store.pos_pin || '',
        status: store.status || '',
        created_on: store.created_on || '',
        updated_on: store.updated_on || '',
        created_by: store.created_by || '',
        updated_by: store.updated_by || '',
        permissions: store.permissions || '',
        profiles: store.profiles || '',
      });
    });

    // Create buffer and save
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

const formattedDate =  this.datePipe.transform(new Date(), 'dd MMM yyyy');


      FileSaver.saveAs(blob, `staffList${formattedDate}.xlsx`);
    });
  }
  search(){
 
  this.staff_list = this.staffListSorting.filter((store:any) => {
    return (
      ( store.first_name.toLowerCase().includes(this.staffForm.value.staffeName.toLowerCase())) &&    ( store.email.toLowerCase().includes(this.staffForm.value.email.toLowerCase())) &&( store.address.toLowerCase().includes(this.staffForm.value.address.toLowerCase())) &&( store.status.toLowerCase().includes(this.staffForm.value.status.toLowerCase())) 
    );
  });
  console.log(this.staff_list)
}
reset(){
  this.staffForm.reset()
  this.getStaffList()
}
}
