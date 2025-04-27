import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
// import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from '../../../shared/interface/table.interface';
import { ProductsList } from '../../../shared/data/products';
import { AgGridAngular } from '@ag-grid-community/angular'; 
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMenuModalComponent } from '../add-menu-modal/add-menu-modal.component';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  storename: string;
  email: string;
  phoneNumber: number;
  storeAddress:string;
  status:string
  }
@Component({
  selector: 'app-add-menus',
  imports: [CardComponent,AgGridAngular],
  templateUrl: './add-menus.component.html',
  styleUrl: './add-menus.component.scss'
})
export class AddMenusComponent {
modules = [ClientSideRowModelModule];
    public products = ProductsList;
    stausList=['Active','In-Active']
    columnDefs: ColDef<RowData>[] = [    // <-- Important to give <RowData> here!
      { field: 'storename', headerName: 'Store Name', sortable: true,
        suppressMenu: true,
        unSortIcon: true },
      { field: 'email', headerName: 'E-Mail',suppressMenu: true,
        unSortIcon: true  },
      { field: 'phoneNumber', headerName: 'Phone Number',suppressMenu: true,
        unSortIcon: true  },
      { field: 'storeAddress', headerName: 'Store Address',suppressMenu: true,
        unSortIcon: true  },
      {
        headerName: 'Status',
        field: 'status',
        editable: true,
        suppressMenu: true,
        unSortIcon: true ,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Active', 'Inactive', 'Pending']
        },
        cellStyle: (params: any) => {
          // Return an object with valid style properties
          const style: { [key: string]: string } = {}; // Create an object to store the styles
          
          if (params.value === 'Active') {
            style['backgroundColor'] = '#6cbd7e0f';
style['border'] ='2px solid rgba(108, 189, 126, .2)'
            style['color'] = '#6cbd7e';
          } else if (params.value === 'Inactive') {
            style['backgroundColor'] = '#dc3545';
            style['color'] = 'white';
          } else if (params.value === 'Pending') {
            style['backgroundColor'] = '#ffc107';
            style['color'] = 'black';
          }
      
          // Always return the style object, even if it doesn't match any condition
          return style;
        }
      },
      
      
      
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
        { storename: 'Toyota', email: 'Celica', status: 'Active' ,phoneNumber: 35000 ,storeAddress:'Abc Address'},
        { storename: 'Ford', email: 'Mondeo',status: 'Inactive', phoneNumber: 32000 ,storeAddress:'Abc Address'},
        { storename: 'Porsche', email: 'Boxster',status: 'Pending', phoneNumber: 72000,storeAddress:'Abc Address' }
      ];
  constructor(public modal: NgbModal) { }

    public tableConfig: TableConfig = {
        columns: [
            // { title: "Product Image", dataField: 'product_image', type: 'image' },
            { title: "Store Name", dataField: 'product_name' },
            { title: "Email", dataField: 'category' },
            { title: "Phone", dataField: 'current_qty', class: 'f-w-500' },
            { title: "Address", dataField: 'price', class: 'td-price' },
            { title: "Status", dataField: 'status' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.products,
    };
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
    insertMenu(){
          this.modal.open(AddMenuModalComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
    }
  }