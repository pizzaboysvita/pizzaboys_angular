import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AddComponent } from './../add/add.component';
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-grocery',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AgGridAngular, CardComponent],
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe] // ✅ provide DatePipe here
})
export class GroceryComponent implements OnInit {
  @ViewChild('viewModal') viewModalRef!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModalRef!: TemplateRef<any>;

  groceryForm: FormGroup;
  statusList = ['Active', 'Inactive', 'Pending'];
  selectedItem: any = null;

  rowData: any[] = [];
  token = 'your_jwt_token_here';  // ⚠️ Replace with real token or AuthService

  tableConfig: ColDef[] = [
    { headerName: 'S.No', valueGetter: (params) => (params.node?.rowIndex ?? -1) + 1, maxWidth: 80 },
    { field: 'item_name', headerName: 'Item Name', filter: true },
    { field: 'quantity', headerName: 'Quantity', filter: true },
    {
      field: 'created_on',
      headerName: 'Created Date',
      valueFormatter: params => this.datePipe.transform(params.value, 'dd-MM-yyyy') ?? ''
    },
    {
      field: 'updated_on',
      headerName: 'Updated Date',
      valueFormatter: params => this.datePipe.transform(params.value, 'dd-MM-yyyy') ?? ''
    },
   {
  headerName: 'Status',
  field: 'status',
  cellRenderer: (params: any) => {
    let label = '';
    let statusClass = '';

    // Convert numeric or string value to label + class
    if (params.value == 1 || params.value === 'Active') {
      label = 'Active';
      statusClass = 'status-active';
    } else {
      label = 'Inactive';
      statusClass = 'status-inactive';
    }

    return `<div class="status-badge ${statusClass}">${label}</div>`;
  },
  editable: false,
  cellEditor: 'agSelectCellEditor',
  cellEditorParams: {
    values: ['Active', 'Inactive'],
  },
  valueFormatter: (params: any) => {
    // Convert numeric to readable string
    return params.value == 1 ? 'Active' : 'Inactive';
  },
  valueParser: (params: any) => {
    // Convert string back to numeric value when edited
    return params.newValue === 'Active' ? 1 : 0;
  },
  suppressMenu: true,
  unSortIcon: true,
},

    {
      headerName: 'Actions',
      cellRenderer: () => `
        <div style="display:flex; gap:10px">
          <button class="btn btn-sm p-0" data-action="view" title="View">
            <span class="material-symbols-outlined text-warning">visibility</span>
          </button>
          <button class="btn btn-sm p-0" data-action="edit" title="Edit">
            <span class="material-symbols-outlined text-success">edit</span>
          </button>
          <button class="btn btn-sm p-0" data-action="delete" title="Delete">
            <span class="material-symbols-outlined text-danger">delete</span>
          </button>
        </div>
      `,
      minWidth: 120
    }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private apiService: ApisService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.groceryForm = this.fb.group({
      itemname: [''],
      quantity: [''],
      status: ['']
    });

    this.loadInventory();
  }

  // 🔹 Fetch inventory list
  loadInventory(): void {
    this.apiService.getApi(AppConstants.api_end_points.inventory).subscribe({
      next: (res:any) => {
        this.rowData = res.data || res;
        console.log("Inventory loaded:", this.rowData);

      },
      error: (err) => {
        console.error('Error loading inventory:', err);
        Swal.fire('Error', 'Failed to load inventory', 'error');
      }

    });
  }

  // 🔹 Open Add Modal
  openNew(type:any) {
    const modalRef = this.modalService.open(AddComponent, { centered: true, backdrop: 'static', size: 'md' });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.editData = this.selectedItem; // Ensure it's in 'add' mode
     modalRef.result.then(
      (result) => {
        console.log('Modal closed with:', result);
        this.loadInventory()
      },
      () => {
        console.log('Modal dismissed');
        this.loadInventory()
      }
    );
  }

  // 🔹 Delete confirmation
  confirmDelete(modal: any) {
    // if (!this.selectedItem) return;

    // this.apiService.deleteApi(AppConstants.api_end_points.inventory,{}).subscribe({
    //   next: () => {
    //     modal.close();
    //     Swal.fire('Deleted!', `${this.selectedItem.item_name} has been removed.`, 'success');
    //     this.loadInventory();
    //     this.selectedItem = null;
    //   },
    //   error: () => Swal.fire('Error', 'Failed to delete item', 'error')
    // });

  const payload = {
  "type": "delete",
  'item_id':this.selectedItem.item_id,
  "store_id":this.selectedItem.store_id,
  "item_name": this.selectedItem.item_name,
  "quantity": this.selectedItem.quantity,
  "unit": this.selectedItem.unit,
  "item_state": this.selectedItem.item_state,
  "imported_from": this.selectedItem.imported_from,
}
        this.apiService.postApi(AppConstants.api_end_points.inventory, payload).subscribe((data: any) => {
          if (data.code == 1) {
            modal.dismiss();
            Swal.fire({
              title: 'Success!',
              text: data.message,
              icon: 'success',
              width: '350px',  // customize width (default ~ 600px)
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('User clicked OK');
                this.loadInventory();
              }
            });
          }
        })
  }

  // 🔹 Grid action handler
  onCellClicked(event: any): void {
    const action = (event.event.target as HTMLElement).closest('button')?.dataset['action'];
    if (!action) return;

    if (action === 'view') {
      this.selectedItem = event.data;
       this.openNew('View')
      // this.modalService.open(this.viewModalRef, { centered: true, backdrop: 'static' });
    }
    if (action === 'edit') {
         this.selectedItem = event.data;
         this.openNew('Edit')
      // TODO: Hook edit modal like AddComponent (update API)
    }
    if (action === 'delete') {
      this.selectedItem = event.data;
      this.modalService.open(this.deleteModalRef, { centered: true, backdrop: 'static' });
    }
  }

  // 🔹 Search (client-side)
  search() {
    const form = this.groceryForm.value;
    this.rowData = this.rowData.filter(item =>
      (!form.itemname || item.item_name.toLowerCase().includes(form.itemname.toLowerCase())) &&
      (!form.quantity || item.quantity.toString().includes(form.quantity)) &&
      (!form.status || item.status === form.status)
    );
  }

  // 🔹 Reset & reload
  reset() {
    this.groceryForm.reset();
    this.loadInventory();
  }

  // 🔹 Export to Excel
  exportExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Grocery');

    worksheet.columns = [
      { header: 'Item Name', key: 'item_name', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Created Date', key: 'created_on', width: 20 },
      { header: 'Updated Date', key: 'updated_on', width: 20 }
    ];

    this.rowData.forEach(item => {
      worksheet.addRow({
        item_name: item.item_name,
        quantity: item.quantity,
        status: item.status,
        created_on: this.datePipe.transform(item.created_on, 'dd-MM-yyyy'),
        updated_on: this.datePipe.transform(item.updated_on, 'dd-MM-yyyy')
      });
    });

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `GroceryList.xlsx`);
    });
  }

}
