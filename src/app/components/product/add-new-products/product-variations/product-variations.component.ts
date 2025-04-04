import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { CardComponent } from "../../../../shared/components/card/card.component";

@Component({
    selector: 'app-product-variations',
    templateUrl: './product-variations.component.html',
    styleUrl: './product-variations.component.scss',
    imports: [CardComponent, NgSelectModule, FormsModule, TagInputModule]
})

export class ProductVariationsComponent {

    public items = [];
    public htmlContent = '';
    public selectedOptionName: string[] = [];
    public placeholderOptionName = [
        { id: 1, name: 'Color' },
        { id: 2, name: 'Size' },
        { id: 3, name: 'Material' },
        { id: 4, name: 'Style' },
    ]


}
