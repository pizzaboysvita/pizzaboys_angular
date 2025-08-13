import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
// import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from '../../../shared/interface/table.interface';
import { ProductsList } from '../../../shared/data/products';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ITooltipParams, ModuleRegistry } from '@ag-grid-community/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../app.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ApisService } from '../../../shared/services/apis.service';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { DatePipe } from '@angular/common';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  store_name: string;
  email: string;
  phone: number;
  street_address: string;
  status: string
  created_on:Date
}
@Component({
  selector: 'app-restaurants-list',
  imports: [CardComponent, AgGridAngular,ReactiveFormsModule,FormsModule],
  templateUrl: './restaurants-list.component.html',
  styleUrl: './restaurants-list.component.scss',
  providers:[DatePipe]
})
export class RestaurantsListComponent {
  @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  gridOptions = {
    pagination: true,

  };
storeForm:FormGroup
  storeList: any;
  storeData: any;
  storeListSorting: any;
  constructor(private router: Router, private apis: ApisService,private fb:FormBuilder, private datePipe:DatePipe,private modalService: NgbModal, private session: SessionStorageService) { }
  modules = [ClientSideRowModelModule];

  stausList = ['Active', 'In-Active']
  columnDefs: ColDef<RowData>[] = [   
    {
      field: 'store_name', headerName: 'Store Name', sortable: true,
      suppressMenu: true,
      unSortIcon: true,
          tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'email', headerName: 'E-Mail', suppressMenu: true,
      unSortIcon: true,
        tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'phone', headerName: 'Phone Number', suppressMenu: true,
      unSortIcon: true
    },
    {
      field: 'street_address', headerName: 'Store Address', suppressMenu: true,
      unSortIcon: true,
          tooltipValueGetter: (p: ITooltipParams) =>p.value,
    },
    {
      field: 'created_on', headerName: 'Created Date', suppressMenu: true,
      unSortIcon: true,
          tooltipValueGetter: (p: ITooltipParams) =>p.value,
   valueFormatter: (params) => {
  if (!params.value) return '';
  const date = new Date(params.value);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
}

    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        let statusClass = '';
        if (params.value == 'Active') {
          statusClass = 'status-active';
        } else if (params.value == 'Inactive') {
          statusClass = 'status-no-stock';
        } else if (params.value === 'Pending') {
          statusClass = 'status-hide';
        }
        if (params.value === '') {
          return `
                <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                    <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="No Stock">No Stock</option>
                  <option value="Hide">Hide</option>
                </select>
              `;
        }
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true, // Make the cell editable
      cellEditor: 'agSelectCellEditor', // Use the ag-Grid built-in select editor
      cellEditorParams: {
        values: ['Active', 'Inactive', 'Pending'], // List of values for the dropdown
      },
      suppressMenu: true,
      unSortIcon: true
    },



    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px;">
          <button class="btn btn-sm  p-0" data-action="view" title="View">
         <span class="material-symbols-outlined  text-warning">
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
        </div>
      `;
      },
      minWidth: 150,
      flex: 1
    }
  ];

  // rowData: RowData[] = [
  //   { storename: 'Toyota', email: 'Celica', status: 'Active' ,phoneNumber: 35000 ,storeAddress:'Abc Address'},
  //   { storename: 'Ford', email: 'Mondeo',status: 'Inactive', phoneNumber: 32000 ,storeAddress:'Abc Address'},
  //   { storename: 'Porsche', email: 'Boxster',status: 'Pending', phoneNumber: 72000,storeAddress:'Abc Address' }
  // ];
  ngOnInit() {
    this.storeForm =this.fb.group({
      storeName:[''],
      email:[''],
      address:[''],
      status:['Active']
    })
    this.getStoreList()
  }
  getStoreList() {
    this.apis.getApi(AppConstants.api_end_points.store_list).subscribe((data: any) => {
      console.log(data)
      data.forEach((element: any) => {
        element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : element.status
      })
      this.storeList = data.reverse()
         this.storeListSorting = data.reverse()
    })
  }
  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.dataset?.['action'];
    const rowData = event.data;
    console.log(action, 'action')
    if (action) {
      switch (action) {
        case 'view':
          console.log('Viewing:', rowData);
                this.session.setsessionStorage('storeType','view')
          this.session.setsessionStorage('storeDetails',JSON.stringify(rowData))
          this.router.navigate(['/restaurants/restaurants-view'])
          break;
        case 'edit':
          console.log('Editing:', rowData);
             this.session.setsessionStorage('storeType','edit')
          this.session.setsessionStorage('storeDetails',JSON.stringify(rowData))
          this.router.navigate(['/restaurants/restaurants-view'])
          break;
        case 'delete':
          console.log('Deleting:', rowData);
          this.storeData = rowData
          this.openConfirmPopup()
          break;
      }
    }
  }


  openNew() {
    this.router.navigate(["/restaurants/add-restaurants"]);

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
      "store_id": this.storeData.store_id
    }
    this.apis.deleteApi(AppConstants.api_end_points.store_list+'/'+this.storeData.store_id).subscribe((data: any) => {

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
            this.getStoreList();
          }
        });

      }
    })
  }




downloadDevicesExcel(): void {
  if (!this.storeList || this.storeList.length === 0) {
    console.warn('No data to export.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Stores');

  // Define header row with styles
  const headers = [
    { header: 'Store Name', key: 'store_name', width: 20 },
    { header: 'E-Mail', key: 'email', width: 25 },
    { header: 'Phone Number', key: 'phone', width: 15 },
    { header: 'Store Address', key: 'street_address', width: 30 },
    { header: 'Created Date', key: 'created_on', width: 20 },
    { header: 'Status', key: 'Status', width: 12 },
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
  this.storeList.forEach((store: any) => {
    worksheet.addRow({
      store_name: store.store_name || '',
      email: store.email || '',
      phone: store.phone || '',
      street_address: store.street_address || '',
      created_on: store.created_on || '',
      Status: store.Status || '',
    });
  });

  // Create buffer and save
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    // const today = new Date();
const formattedDate =  this.datePipe.transform(new Date(), 'dd MMM yyyy');
    FileSaver.saveAs(blob, `storesList_${formattedDate}.xlsx`);
  });
}
search(){
  console.log(this.storeForm.value.status, this.storeListSorting)
  this.storeList = this.storeListSorting.filter((store:any) => {
    return (
      ( store.store_name.toLowerCase().includes(this.storeForm.value.storeName.toLowerCase())) &&    ( store.email.toLowerCase().includes(this.storeForm.value.email.toLowerCase())) &&( store.street_address.toLowerCase().includes(this.storeForm.value.address.toLowerCase())) &&( store.status.toLowerCase().includes(this.storeForm.value.status.toLowerCase())) 
    );
  });
  console.log(this.storeList)
}
reset(){
  this.storeForm.reset()
  this.getStoreList()
}
}

