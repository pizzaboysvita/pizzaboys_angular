import { Component } from '@angular/core';
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrl: './shipping.component.scss',
    imports: [CardComponent, NgSelectModule, FormsModule]
})

export class ShippingComponent {

    public selectedDimensions: string[] = [];
    public placeholderDimensions = [
        { id: 1, name: 'Length' },
        { id: 2, name: 'Width' },
        { id: 3, name: 'Height' },
    ]

}
