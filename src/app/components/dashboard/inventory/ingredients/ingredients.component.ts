import { ColDef } from '@ag-grid-community/core';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { AddComponent } from '../add/add.component';
import * as ExcelJS from 'exceljs';
import { AgGridAngular } from "@ag-grid-community/angular";
import { CardComponent } from "../../../../shared/components/card/card.component";

@Component({
  selector: 'app-ingredients',
  imports: [AgGridAngular, CardComponent,ReactiveFormsModule],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss'
})
export class IngredientsComponent {
 @ViewChild('viewModal') viewModalRef!: TemplateRef<any>;

  groceryForm: FormGroup;

  statusList = ['Active', 'Inactive', 'Pending'];

  selectedItem: any = null;

  // Static dummy data
  rowData = [
  { itemname: 'Apples', quantity: 50, created: '2025-09-01', updated: '2025-09-02', status: 'Active' },
  { itemname: 'Bananas', quantity: 30, created: '2025-08-28', updated: '2025-09-01', status: 'Inactive' },
  { itemname: 'Oranges', quantity: 20, created: '2025-08-30', updated: '2025-09-01', status: 'Pending' },
  { itemname: 'Tomatoes', quantity: 100, created: '2025-08-25', updated: '2025-09-02', status: 'Active' }
];

  // AG Grid columns
  tableConfig: ColDef[] = [
  {
    headerName: 'S.No',
    valueGetter: (params) => (params.node && params.node.rowIndex != null ? params.node.rowIndex + 1 : ''),
    maxWidth: 80
  },
  { field: 'itemname', headerName: 'Item Name', filter: true },
  { field: 'quantity', headerName: 'Quantity', filter: true },
  { field: 'created', headerName: 'Created Date' },
  { field: 'updated', headerName: 'Updated Date' },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: (params: any) => {
      const select = document.createElement('select');
      select.className = 'form-select form-select-sm';
      ['Active', 'Inactive', 'Pending'].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.text = opt;
        if (opt === params.value) option.selected = true;
        select.appendChild(option);
      });
      select.addEventListener('change', (event) => {
        params.setValue((event.target as HTMLSelectElement).value);
      });
      return select;
    }
  },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
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
        `;
      },
      minWidth: 120
    }
  ];

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.groceryForm = this.fb.group({
      itemname: [''],
      quantity: [''],
      status: ['']
    });
  }

  // Action handler
 onCellClicked(event: any): void {
  const action = (event.event.target as HTMLElement).closest('button')?.dataset['action'];
  if (!action) return;

  if (action === 'view') {
    this.selectedItem = event.data;
    this.modalService.open(this.viewModalRef, { centered: true, backdrop: 'static' });
  }

  if (action === 'edit') {
    this.modalService.open(AddComponent, { centered: true, backdrop: 'static', size: 'md' });
  }

  if (action === 'delete') {
    this.selectedItem = event.data;  // store selected item
    this.modalService.open(this.confirmDelete, { centered: true, backdrop: 'static' });
  }
}

// Confirm delete function
confirmDelete(modal: any) {
  this.rowData = this.rowData.filter(item => item !== this.selectedItem);
  modal.close();
  Swal.fire({
    title: 'Deleted!',
    text: `${this.selectedItem.itemname} has been removed.`,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });
  this.selectedItem = null;
}
  search() {
    const form = this.groceryForm.value;
    this.rowData = this.rowData.filter(item =>
      (!form.itemname || item.itemname.toLowerCase().includes(form.itemname.toLowerCase())) &&
      (!form.quantity || item.quantity.toString().includes(form.quantity)) &&
      (!form.status || item.status === form.status)
    );
  }

  reset() {
    this.groceryForm.reset();
    this.rowData = [
  { itemname: 'Apples', quantity: 50, created: '2025-09-01', updated: '2025-09-02', status: 'Active' },
  { itemname: 'Bananas', quantity: 30, created: '2025-08-28', updated: '2025-09-01', status: 'Inactive' },
  { itemname: 'Oranges', quantity: 20, created: '2025-08-30', updated: '2025-09-01', status: 'Pending' },
  { itemname: 'Tomatoes', quantity: 100, created: '2025-08-25', updated: '2025-09-02', status: 'Active' }
];
  }

  openNew() {
    this.modalService.open(AddComponent, { centered: true, backdrop: 'static', size: 'md' });
  }
  exportExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Grocery');

    worksheet.columns = [
      { header: 'Item Name', key: 'itemname', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    this.rowData.forEach(item => {
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `GroceryList.xlsx`);
    });
  }
}
