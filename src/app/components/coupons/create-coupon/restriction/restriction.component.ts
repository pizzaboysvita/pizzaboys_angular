import { Component } from '@angular/core';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-restriction',
    templateUrl: './restriction.component.html',
    styleUrl: './restriction.component.scss',
    imports: [DropdownComponent]
})

export class RestrictionComponent {

  public category = ['--Select--','Electronics','Clothes','Shoes','Digital'];

}
