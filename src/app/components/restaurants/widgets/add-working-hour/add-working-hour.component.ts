import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-add-working-hour',
    templateUrl: './add-working-hour.component.html',
    styleUrl: './add-working-hour.component.scss',
    imports: [DropdownComponent]
})

export class AddWorkingHourComponent {

  constructor(public modal: NgbModal) { }

  public day = ['Select Days', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

}
