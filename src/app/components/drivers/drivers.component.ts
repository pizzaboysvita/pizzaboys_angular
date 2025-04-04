import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../shared/components/card/card.component";
import { DriverDetailsComponent } from "./driver-details/driver-details.component";
import { ActivateDeactivateComponent } from "./activate-deactivate/activate-deactivate.component";
import { CarDetailsComponent } from "./car-details/car-details.component";

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrl: './drivers.component.scss',
    imports: [CardComponent, NgbNavModule, DriverDetailsComponent, ActivateDeactivateComponent, CarDetailsComponent]
})

export class DriversComponent {

    public active = 1;

}
