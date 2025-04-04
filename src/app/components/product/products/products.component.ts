import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { ProductsList } from '../../../shared/data/products';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [CardComponent, CommonModule, RouterModule,
        FormsModule, TableComponent]
})

export class ProductsComponent {

    public products = ProductsList;

    public tableConfig: TableConfig = {
        columns: [
            { title: "Product Image", dataField: 'product_image', type: 'image' },
            { title: "Product Name", dataField: 'product_name' },
            { title: "Category", dataField: 'category' },
            { title: "Current Qty", dataField: 'current_qty', class: 'f-w-500' },
            { title: "Price", dataField: 'price', class: 'td-price' },
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

    ngOnInit() {
        if (this.products) {
            let product = this.products.map(element => { 
                return {
                    ...element,
                    status: element.status ? `<div class="${element.status_class}"><span>${element.status}</span></div>` : '-'
                };
            });
            this.tableConfig.data = this.products ? product : [];
        }
    }
}
