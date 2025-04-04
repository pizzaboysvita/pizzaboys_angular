import { Component } from '@angular/core';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";

export interface data {
    
} 

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
    imports: [DropdownComponent]
})

export class GeneralComponent {

    public DiscountType = ['--Select--','Percent','Fixed'];

}
