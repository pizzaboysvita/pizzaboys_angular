import { Component } from '@angular/core';
import { DropdownComponent } from "../widgets/dropdown/dropdown.component";
import { DarkLogoComponent } from "./dark-logo/dark-logo.component";
import { FaviconComponent } from "./favicon/favicon.component";
import { LightLogoComponent } from "./light-logo/light-logo.component";

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
    imports: [LightLogoComponent, DarkLogoComponent, FaviconComponent, DropdownComponent]
})

export class GeneralComponent {

    public timezone = ['Kolkata', 'Surat', 'Gandhinagar', 'Delhi', 'Ahmadabad'];
    public currency = ['USD', 'INR', 'GBP', 'EUR'];
    public direction = ['LTR', 'RTL'];
    public mode = ['Light', 'Dark'];

}
