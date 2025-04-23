import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from '../../../shared/interface/table.interface';
import { ProductsList } from '../../../shared/data/products';

@Component({
  selector: 'app-restaurants-list',
  imports: [CardComponent,TableComponent],
  templateUrl: './restaurants-list.component.html',
  styleUrl: './restaurants-list.component.scss'
})
export class RestaurantsListComponent {
    public products = ProductsList;
    stausList=['Active','In-Active']
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
