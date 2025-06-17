import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TableConfig } from '../../../shared/interface/table.interface';
import { staffList } from '../../../shared/data/products';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../widgets/table/table.component';
import { Router } from '@angular/router';
import { AppConstants } from '../../../app.constants';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  staff_id: string;
  user_image: string;
  phone_number: number;
  fullname: string;
  status: string
  address:string
}
@Component({
  selector: 'app-staff-list',
    imports: [CardComponent,CommonModule,AgGridAngular],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss',
   encapsulation: ViewEncapsulation.None
})
export class StaffListComponent {
   @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  staff_list: any;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  gridOptions = {
    pagination: true,
rowHeight: 60 
  };
      modules = [ClientSideRowModelModule];
    // public tableConfig= [
     
    //       { title: "Staff Id", dataField: 'staff_id', class: 'f-w-600' },
    //       { title: "Staff Photo", dataField: 'user_image', type: 'image', class: 'rounded' },
    //       { title: "Name", dataField: 'fullname' },
    //       { title: "Email", dataField: 'email', class: 'f-w-600' },
    //       { title: "Phone", dataField: 'phone_number' },
    //        { title: "Address", dataField: 'address' },
    //        { title: "Status", dataField: 'status' },
    //         // { title: "Options", type: "status" },
       
    //   ]
      tableConfig: ColDef<RowData>[] = [
  {
    field: 'staff_id',
    headerName: 'Staff Id',
    sortable: true,
    suppressMenu: true,
    unSortIcon: true,
  },
  {
    field: 'user_image',
    headerName: 'Staff Photo',
    sortable: true,
    suppressMenu: true,
    unSortIcon: true,
    cellRenderer: (params: any) => {
      // Fallback to initials if no image
      const image = params.value;
      const firstName = params.data?.first_name;

      if (image) {
        return `
          <img src="${image}" class="img-fluid rounded-circle" width="40" height="40" alt="${firstName}" />
        `;
      } else {
        // fallback to initials
        return `
          <div class="avatar-placeholder rounded-circle text-white d-flex align-items-center justify-content-center"
            style="width: 40px; height:40px; font-weight: bold; font-size: 1rem; background-color:${this.getColorForName(firstName)}">
            ${firstName ? firstName.charAt(0).toUpperCase() : '?'}
          </div>
        `;
      }
    },
  },
  {
    field: 'fullname',
    headerName: 'Name',
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
  constructor(private router:Router,private apis:ApisService,private modalService: NgbModal,private session: SessionStorageService){

    this.getStaffList()
  }
  
    stausList=['Active','In-Active']
  
    getStaffList(){
    
      this.apis.getApi(AppConstants.api_end_points.staff).subscribe((data:any)=>{
        if(data){
data.forEach((element:any)=>{
  // element.option=''
  element.user_image= null,
  element.fullname=element.first_name+' '+element.last_name
  element.status=element.status ==1?'Active':element.status ==0?'Inactive':''
})
          this.staff_list=data
        
        }
      })
    }
    openNew(){
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
    return `hsl(${hue}, 60%, 50%)`; // You can tweak saturation/lightness as needed
  }
  performAction(data:any){

    console.log(data)
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
  delete(data:any){
    this.staffData=data
      this.openConfirmPopup()

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
   const req_body={
     "staff_id": this.staffData.staff_id
 }
  this.apis.deleteApi(AppConstants.api_end_points.staff,req_body).subscribe((data:any)=>{
  
   if(data){
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
