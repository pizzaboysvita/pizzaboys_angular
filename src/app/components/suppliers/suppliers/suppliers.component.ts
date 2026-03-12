import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, GridOptions, CellClickedEvent } from '@ag-grid-community/core';
import { NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddSuppliersComponent } from '../add-suppliers/add-suppliers.component';
@Component({
  selector: 'app-suppliers',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    NgbDropdownModule,
    CardComponent,
    NgSelectModule
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent {

  suppliersForm!: FormGroup;

  supplierList: any[] = [];
  supplierData: any[] = [];
  supplierDataBackup: any[] = [];

  selectedItem: any;

  @ViewChild('confirmModal') confirmModal!: any;

  gridOptions: GridOptions = {
    rowHeight: 80
  };

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    unSortIcon: true,
    suppressMenu: true,

  };

  tableConfig: ColDef[] = [

    { headerName: 'S.No', valueGetter: (params) => (params.node?.rowIndex ?? -1) + 1, maxWidth: 80 },

    {
      headerName: 'Client Name',
      field: 'client_name',
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,

    },
    {
      headerName: 'Email',
      field: 'email',
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: 'Provider',
      field: 'provider',
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: 'Address',
      field: 'address',
      sortable: true,
      tooltipField: 'address',
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: 'Item',
      field: 'item',
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: 'Actions',
      minWidth: 150,
      cellRenderer: () => `
     <div style="display:flex;align-items:center;gap:15px">
        <button class="btn btn-sm p-0" data-action="view">
          <span class="material-symbols-outlined text-warning">visibility</span>
        </button>
        <button class="btn btn-sm p-0" data-action="edit">
          <span class="material-symbols-outlined text-success">edit</span>
        </button>
        <button class="btn btn-sm p-0" data-action="delete">
          <span class="material-symbols-outlined text-danger">delete</span>
        </button>
      </div>
    `
    }
  ];
  itemList: readonly any[] | null | undefined;
  clientList: readonly any[] | null | undefined;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
    this.loadSupplierData();
  }

  initForm() {
    this.suppliersForm = this.fb.group({
      supplier_id: [-1, Validators.required]
    });
  }

  loadSuppliers() {
    this.supplierList = [
      { supplier_id: -1, supplier_name: 'All Suppliers' },
      { supplier_id: 201, supplier_name: 'ABC Traders' },
      { supplier_id: 202, supplier_name: 'Fresh Farms Ltd' }
    ];
  }

  loadSupplierData() {
    this.supplierData = [
      {
        supplier_id: 201,
        client_name: 'John Doe',
        email: 'john@mail.com',
        provider: 'ABC Traders',
        address: 'Chennai, Tamil Nadu',
        item: 'Vegetables'
      },
      {
        supplier_id: 202,
        client_name: 'Ravi Kumar',
        email: 'ravi@mail.com',
        provider: 'Fresh Farms Ltd',
        address: 'Bangalore, Karnataka',
        item: 'Fruits'
      }
    ];

    this.supplierDataBackup = [...this.supplierData];
  }

  search() {
    const { client_name, item_id } = this.suppliersForm.value;

    this.supplierData = this.supplierDataBackup.filter(item => {
      const clientMatch =
        !client_name ||
        item.client_name?.toLowerCase().includes(client_name.toLowerCase());

      const itemMatch =
        !item_id || item.item_id === item_id;

      return clientMatch && itemMatch;
    });
  }


  reset() {
    this.suppliersForm.reset();
    this.supplierData = [...this.supplierDataBackup];
  }

  openNew() {
    const modalRef = this.modalService.open(AddSuppliersComponent, {
      centered: true,
      backdrop: 'static',
      size: 'l'
    });

    modalRef.componentInstance.type = 'Add';

    modalRef.result.then((res) => {
      if (res) {
        this.loadSupplierData();
      }
    });
  }

  onCellClicked(event: CellClickedEvent) {
    let target = event.event?.target as HTMLElement;

    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }

    const action = target?.getAttribute('data-action');

    if (action === 'delete') {
      this.selectedItem = event.data;
      this.modalService.open(this.confirmModal, {
        centered: true,
        backdrop: 'static'
      });
    }
  }

  onConfirm(modal: any) {
    console.log('Delete:', this.selectedItem);
    modal.close();
  }
}
