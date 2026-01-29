import { Component } from '@angular/core';
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

  gridOptions: GridOptions = {
    rowHeight: 90
  };

  tableConfig: ColDef[] = [
    { headerName: 'Store ID', field: 'store_id', minWidth: 120 },
    { headerName: 'Text', field: 'text', minWidth: 220, tooltipField: 'text' },
    {
      headerName: 'Image Banner',
      field: 'image',
      minWidth: 180,
      cellRenderer: (params: any) =>
        params.value
          ? `<img src="${params.value}"
              style="width:70px;height:45px;object-fit:cover;border-radius:6px" />`
          : '-'
    },
    {
      headerName: 'Video',
      field: 'video',
      minWidth: 220,
      cellRenderer: (params: any) =>
        params.value
          ? `<video width="120" height="70" controls>
               <source src="${params.value}" type="video/mp4">
             </video>`
          : '-'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStores();
    this.loadInventory();
  }

  initForm() {
    this.adminMediaForm = this.fb.group({
      store_id: ['', Validators.required]
    });
  }

  get f() {
    return this.adminMediaForm.controls;
  }

  loadStores() {
    // TEMP static data – replace with API
    this.storesList = [
      { store_id: 101, store_name: 'Pizza Boyz - Flat Bush' },
      { store_id: 102, store_name: 'Pizza Boyz - Downtown' }
    ];
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
  }

  search() {
    if (this.adminMediaForm.invalid) {
      this.adminMediaForm.markAllAsTouched();
      return;
    }

    console.log('Search:', this.adminMediaForm.value);
    // API filter call here
  }

  reset() {
    this.adminMediaForm.reset();
    this.loadInventory();
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

  onCellClicked(event: CellClickedEvent) {
    this.selectedItem = event.data;
  }

  onConfirm(modal: any) {
    console.log('Delete:', this.selectedItem);
    modal.close();
  }
}
