import { AgGridAngular } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../shared/components/card/card.component';
import { AddAdminMediaComponent } from './add-admin-media/add-admin-media.component';
import { CellClickedEvent, ColDef, GridOptions } from '@ag-grid-community/core';

@Component({
  selector: 'app-admin-media',
   standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    AgGridAngular,
    CardComponent
  ],
  templateUrl: './admin-media.component.html',
  styleUrl: './admin-media.component.scss'
})
export class AdminMediaComponent {

  staffForm!: FormGroup;
  stausList = ['Active', 'Inactive'];

  staff_list: any[] = [];
  selectedItem: any;

  gridOptions: GridOptions = {
    rowHeight: 90
  };

  tableConfig: ColDef[] = [
    {
      headerName: 'Store ID',
      field: 'store_id',
      minWidth: 120
    },
    {
      headerName: 'Text',
      field: 'text',
      minWidth: 220,
      tooltipField: 'text'
    },
    {
      headerName: 'Image Banner',
      field: 'image',
      minWidth: 180,
      cellRenderer: (params: any) => {
        return params.value
          ? `<img src="${params.value}"
              style="width:70px;height:45px;object-fit:cover;border-radius:6px" />`
          : '-';
      }
    },
    {
      headerName: 'Video',
      field: 'video',
      minWidth: 220,
      cellRenderer: (params: any) => {
        return params.value
          ? `<video width="120" height="70" controls>
               <source src="${params.value}" type="video/mp4">
             </video>`
          : '-';
      }
    }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      status: ['']
    });

    this.loadInventory();
  }

  loadInventory() {
    // TEMP static data (replace with API)
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
    console.log('Search:', this.staffForm.value);
    // call API with filters here
  }

  reset() {
    this.staffForm.reset();
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
    console.log('Row clicked:', this.selectedItem);
  }

  openEditPopup(item: any) {
    this.selectedItem = item;
    this.openNew('edit');
  }

  onConfirm(modal: any) {
    console.log('Delete:', this.selectedItem);
    modal.close();
  }
}
