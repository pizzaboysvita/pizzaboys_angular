import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-special-offer-working-hour',
    templateUrl: './special-offer-working-hour.component.html',
    styleUrl: './special-offer-working-hour.component.scss',
    imports: [DropdownComponent]
})

export class SpecialOfferWorkingHourComponent {

  constructor(public modal: NgbModal){ }

  public day = ['Select Days', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

}
