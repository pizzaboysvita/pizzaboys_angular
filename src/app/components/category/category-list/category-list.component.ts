import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { FeatherIconsComponent } from "../../../shared/components/feather-icons/feather-icons.component";
import { CategoryList } from '../../../shared/data/products';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.scss',
    imports: [ CardComponent, RouterModule, FormsModule, TableComponent]
})

export class CategoryListComponent {

    public categories = CategoryList;
    
    public tableConfig: TableConfig = {
        columns: [
            { title: "Product Image", dataField: 'product_image', type: 'image' },
            { title: "Product Name", dataField: 'product_name' },
            { title: "Date", dataField: 'date' },
            { title: "Foods", dataField: 'foods' },
            { title: "Options", type: 'option' },
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.categories,
    };

}
