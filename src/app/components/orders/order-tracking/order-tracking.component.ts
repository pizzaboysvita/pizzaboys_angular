import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TrackerTableComponent } from "./tracker-table/tracker-table.component";

@Component({
    selector: 'app-order-tracking',
    templateUrl: './order-tracking.component.html',
    styleUrl: './order-tracking.component.scss',
    imports: [CardComponent, TrackerTableComponent]
})
export class OrderTrackingComponent {

}
