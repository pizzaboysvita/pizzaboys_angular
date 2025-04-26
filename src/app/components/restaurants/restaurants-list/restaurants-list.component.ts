import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
// import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from '../../../shared/interface/table.interface';
import { ProductsList } from '../../../shared/data/products';
import { AgGridAngular } from '@ag-grid-community/angular'; 
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
    make: string;
    model: string;
    price: number;
  }
@Component({
  selector: 'app-restaurants-list',
  imports: [CardComponent,AgGridAngular],
  templateUrl: './restaurants-list.component.html',
  styleUrl: './restaurants-list.component.scss'
})
export class RestaurantsListComponent {
    modules = [ClientSideRowModelModule];
    public products = ProductsList;
    stausList=['Active','In-Active']
    columnDefs: ColDef<RowData>[] = [    // <-- Important to give <RowData> here!
        { field: 'make' },
        { field: 'model' },
        { field: 'price' }
      ];
    
      rowData: RowData[] = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxster', price: 72000 }
      ];
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
}
