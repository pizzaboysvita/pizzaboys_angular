import { Component, ViewChild } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AgGridAngular } from '@ag-grid-community/angular';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CellClickedEvent, ColDef, GridOptions } from '@ag-grid-community/core';
import { AddAdminMediaComponent } from '../add-admin-media/add-admin-media.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    AgGridAngular,
    CardComponent,
    NgSelectModule
  ],
  templateUrl: './admin-media.component.html',
  styleUrl: './admin-media.component.scss'
})
export class AdminMediaComponent {

  adminMediaForm!: FormGroup;

  storesList: any[] = [];
  staff_list: any[] = [];
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
    {
      headerName: 'Store ID',
      field: 'store_id',
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: 'Text',
      field: 'text',
      tooltipField: 'text'
    },
    {
      headerName: 'Image Banner',
      field: 'image',
      sortable: false,
      cellRenderer: (params: any) =>
        params.value
          ? `<img src="${params.value}" class="media-img" />`
          : '-'
    },
    {
      headerName: 'Video',
      field: 'video',
      sortable: false,
      cellRenderer: (params: any) =>
        params.value
          ? `<video class="media-video" controls>
             <source src="${params.value}" type="video/mp4">
           </video>`
          : '-'
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


  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadStores();
    this.loadInventory();
  }

  initForm() {
    this.adminMediaForm = this.fb.group({
      store_id: [null]
    });
  }

  loadStores() {
    this.storesList = [
      { store_id: -1, store_name: 'All Stores' },
      { store_id: 101, store_name: 'Pizza Boyz - Flat Bush' },
      { store_id: 102, store_name: 'Pizza Boyz - Downtown' }
    ];

    this.adminMediaForm = this.fb.group({
      store_id: [-1, Validators.required]
    });
  }


  loadInventory() {
    this.staff_list = [
      {
        store_id: 101,
        text: 'Festival Offer Banner',
        image: 'https://via.placeholder.com/150',
        video: ''
      },
      {
        store_id: 102,
        text: 'New Store Opening',
        image: 'https://via.placeholder.com/150',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }
    ];

    this.mediaListBackup = [...this.staff_list]; // IMPORTANT
  }
  mediaListBackup: any[] = [];

  search() {
    const storeId = this.adminMediaForm.value.store_id;

    if (storeId === -1) {
      this.staff_list = [...this.mediaListBackup];
      return;
    }

    this.staff_list = this.mediaListBackup.filter(
      (item: any) => item.store_id === storeId
    );
  }

  reset() {
    this.adminMediaForm.reset({ store_id: -1 });
    this.staff_list = [...this.mediaListBackup];
  }

  openNew(type: any) {
    const modalRef = this.modalService.open(AddAdminMediaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md'
    });

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.editData = null;

    modalRef.result.finally(() => {
      this.loadInventory();
    });
  }

  editRow(row: any) {
    const modalRef = this.modalService.open(AddAdminMediaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md'
    });

    modalRef.componentInstance.type = 'Edit';
    modalRef.componentInstance.editData = row;

    modalRef.result.finally(() => {
      this.loadInventory();
    });
  }

  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }

    const action = target?.getAttribute('data-action');

    if (action === 'view') {
      console.log('View:', event.data);
    }
    else if (action === 'edit') {
      this.editRow(event.data);
    }
    else if (action === 'delete') {
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
