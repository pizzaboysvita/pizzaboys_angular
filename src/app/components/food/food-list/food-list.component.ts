import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeatherIconsComponent } from "../../../shared/components/feather-icons/feather-icons.component";
import { FoodList } from '../../../shared/data/food';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-food-list',
    templateUrl: './food-list.component.html',
    styleUrl: './food-list.component.scss',
    imports: [FormsModule, FeatherIconsComponent, RouterModule, TableComponent, CardComponent]
})

export class FoodListComponent {
    
    public foodList = FoodList;
    public tableConfig: TableConfig = {
        columns: [
            { title: "Product Image", dataField: 'product_image', type: 'image' },
            { title: "Product Name", dataField: 'product_name' },
            { title: "Price", dataField: 'price' },
            { title: "Restaurant", dataField: 'restaurant' },
            { title: "Category", dataField: 'category'},
            { title: "Food", dataField: 'foods'},
            { title: "Options" ,type: 'option'},
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.foodList,
    };

}
