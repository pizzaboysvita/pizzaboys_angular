import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef } from '@ag-grid-community/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardComponent } from '../../shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddoptionsetmodalComponent } from './addoptionsetmodal/addoptionsetmodal.component';

interface OptionSetRow {
  name: string;
  displayName: string;
  options: number;
  status: string;
}

@Component({
  selector: 'app-optionset',
  standalone: true,
  templateUrl: './optionset.component.html',
  styleUrls: ['./optionset.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridAngular,
    NgSelectModule,
    CardComponent
  ]
})
export class OptionsetComponent implements OnInit {
  searchForm: FormGroup;
  statusList = ['Active', 'In-Active', 'Pending'];

  rowData: OptionSetRow[] = [];
  originalRowData: OptionSetRow[] = [];

  columnDefs: ColDef<OptionSetRow>[] = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Display Name', field: 'displayName' },
    { headerName: 'Options Count', field: 'options' },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ({ value }: { value: string }) => {
        let badgeClass =
          value === 'Active' ? 'status-active' :
            value === 'Pending' ? 'status-hide' :
              'status-no-stock';
        return `<div class="status-badge ${badgeClass}">${value}</div>`;
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: () => {
        return `
          <div style="display: flex; align-items: center; gap:15px;">
            <button class="btn btn-sm p-0" data-action="view" title="View">
              <span class="material-symbols-outlined text-primary">visibility</span>
            </button>
            <button class="btn btn-sm p-0" data-action="edit" title="Edit">
              <span class="material-symbols-outlined text-success">edit</span>
            </button>
            <button class="btn btn-sm p-0" data-action="delete" title="Delete">
              <span class="material-symbols-outlined text-danger">delete</span>
            </button>
          </div>`;
      },
      minWidth: 150,
      flex: 1
    }
  ];

  constructor(private fb: FormBuilder, private modal: NgbModal) {
    this.searchForm = this.fb.group({
      name: [''],
      displayName: [''],
      status: ['']
    });
  }

  ngOnInit() {
    const stored = localStorage.getItem('optionSetData');
    if (stored) {
      this.originalRowData = JSON.parse(stored);
      this.rowData = [...this.originalRowData];
    } else {
      this.originalRowData = [
        { name: 'Extra Cheese', displayName: 'Cheese', options: 5, status: 'Active' },
        { name: 'Toppings', displayName: 'Pizza Toppings', options: 8, status: 'In-Active' },
        { name: 'Crust', displayName: 'Crust Type', options: 3, status: 'Pending' }
      ];
      this.rowData = [...this.originalRowData];
      localStorage.setItem('optionSetData', JSON.stringify(this.originalRowData));
    }
  }



  reset() {
    this.searchForm.reset();
  }

  search() {
    const { name, displayName, status } = this.searchForm.value;

    this.rowData = this.originalRowData.filter(item => {
      return (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
        (!displayName || item.displayName.toLowerCase().includes(displayName.toLowerCase())) &&
        (!status || item.status === status);
    });
  }

  onCellClicked(event: any) {
    const action = event.event?.target?.dataset?.action;
    const row = event.data;

    if (action === 'view') {
      console.log('Viewing', row);
    } else if (action === 'edit') {
      console.log('Editing', row);
    } else if (action === 'delete') {
      console.log('Deleting', row);
    }
  }

  createOptionSet() {
    const modalRef = this.modal.open(AddoptionsetmodalComponent, {
      windowClass: 'theme-modal',
      centered: true,
      size: 'lg'
    });

    modalRef.result.then((result) => {
      if (result) {
        this.originalRowData.push({
          name: result.name,
          displayName: result.displayName,
          options: result.options?.length || 0,
          status: result.status
        });
        localStorage.setItem('optionSetData', JSON.stringify(this.originalRowData));
        this.rowData = [...this.originalRowData];
      }
    }).catch(() => { });
  }

}
