import { Component } from '@angular/core';
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-inventory',
    templateUrl: './product-inventory.component.html',
    styleUrl: './product-inventory.component.scss',
    imports: [CardComponent, NgSelectModule, FormsModule]
})

export class ProductInventoryComponent {

    public selectedStockStatus: string[] = [];
    public placeholderStockStatus = [
        { id: 1, name: 'In Stock' },
        { id: 2, name: 'Out Of Stock' },
        { id: 3, name: 'On Backorder' },
    ]

}
