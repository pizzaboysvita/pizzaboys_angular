import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
// import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from '../../../shared/interface/table.interface';
import { ProductsList } from '../../../shared/data/products';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategoryComponent } from '../add-category/add-category.component';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  menutype: string;
  categoryType: string;
  dishName: string;
  price: string;
  status: string;
  pos: string;
  misc:string
}
@Component({
  selector: 'app-category',
  imports: [CardComponent, AgGridAngular],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  modules = [ClientSideRowModelModule];
  stausList = ['Active', 'No Stock', 'Hide']
  columnDefs: ColDef<RowData>[] = [    // <-- Important to give <RowData> here!
    {
      field: 'menutype', headerName: 'Menu Type', sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: 'menutype' 
    },
    {
      field: 'categoryType', headerName: 'Category Type', suppressMenu: true,
      unSortIcon: true
      ,
      tooltipField: 'categoryType' 
    },
    {
      field: 'dishName', headerName: 'Dish Name', suppressMenu: true,
      unSortIcon: true
      ,
      tooltipField: 'dishName' 
    },
    {
      field: 'price', headerName: 'Price ($)', suppressMenu: true,
      unSortIcon: true
      ,
      tooltipField: 'price' 
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        let statusClass = '';
        if (params.value === 'Active') {
          statusClass = 'status-active';
        } else if (params.value === 'No Stock') {
          statusClass = 'status-no-stock';
        } else if (params.value === 'Hide') {
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
        values: ['Active', 'No Stock', 'Hide'], // List of values for the dropdown
      },
      suppressMenu: true,
      unSortIcon: true
    }
    , {
      headerName: 'POS',
      field: 'pos',
      cellRenderer: (params: any) => {
        let statusClass = '';
        if (params.value === 'Hide in POS') {
          statusClass = 'hide-pos';
        } else if (params.value === 'Show in POS') {
          statusClass = 'show-pos';
        }
        if (params.value === '') {
          return `
            <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                <option value="">Select POS</option>
              <option value="showinpos">Show in POS</option>
              <option value="hideinpos">Hide in POS</option>
              
            </select>
          `;
        }
        return `<div class="pos-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true, // Make the cell editable
      cellEditor: 'agSelectCellEditor', // Use the ag-Grid built-in select editor
      cellEditorParams: {
        values: ['Hide in POS', 'Show in POS'], // List of values for the dropdown
      },
      suppressMenu: true,
      unSortIcon: true
    }
    ,
    {
      headerName: 'MISC',
      field: 'misc',
      cellRenderer: (params: any) => {
        let statusClass = '';
        if (params.value === 'Cancel') {
          statusClass = 'status-active';
        } else if (params.value === 'Delete') {
          statusClass = 'status-no-stock';
        } 
        if (params.value === '') {
          return `
            <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                <option value="">Select MISC</option>
              <option value="Cancel">Cancel</option>
              <option value="Delete">Delete</option>
          
            </select>
          `;
        }
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true, // Make the cell editable
      cellEditor: 'agSelectCellEditor', // Use the ag-Grid built-in select editor
      cellEditorParams: {
        values: ['Cancel', 'Delete'], // List of values for the dropdown
      },
      suppressMenu: true,
      unSortIcon: true
    }
    ,


    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px;">
          <button class="btn btn-sm  p-0" data-action="view" title="View">
         <span class="material-symbols-outlined text-primary">
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

  rowData: RowData[] = [
    { menutype: 'TakeWay Menu', categoryType: 'Valentines Day Promotion', status: '', dishName: 'Pizza chicken', price: '85', pos: 'Hide in POS',misc:'Cancel' },
    { menutype: 'Seasonal menu', categoryType: 'Limited Time Deal', status: 'No Stock', dishName: 'Pizza chicken', price: '90', pos: '',misc:'' },
    { menutype: 'Seasonal menu', categoryType: 'Lunch', status: 'Hide', dishName: 'Pizza chicken', price: '15', pos: 'Hide in POS',misc:'Cancel' }
  ];

  constructor(public modal: NgbModal) { }
  onCellClicked(event: any) {
    if (event.event.target && event.event.target.dataset.action) {
      const action = event.event.target.dataset.action;
      const rowData = event.data;

      if (action === 'view') {
        console.log('Viewing', rowData);
      } else if (action === 'edit') {
        console.log('Editing', rowData);
      } else if (action === 'delete') {
        console.log('Deleting', rowData);
      }
    }
  }
  insertCategory() {
    this.modal.open(AddCategoryComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
  }
}