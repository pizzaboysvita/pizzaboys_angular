import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { CardComponent } from "../../shared/components/card/card.component";
import { LiveTracking } from '../../shared/data/live-tracking';
import { TableConfig } from '../../shared/interface/table.interface';
import { TableComponent } from "../widgets/table/table.component";

@Component({
    selector: 'app-live-tracking',
    templateUrl: './live-tracking.component.html',
    styleUrl: './live-tracking.component.scss',
    imports: [CardComponent, FormsModule, CommonModule, GoogleMapsModule, TableComponent]
})

export class LiveTrackingComponent {

    public searchTerm: string = '';
    public tracking = LiveTracking;
    public markers: any[];
    public zoom: number;

    public tableConfig: TableConfig = {
        columns: [
            { title: "Driver Name", dataField: 'driver_name'},
            { title: "Status", dataField: 'status' },
        ],
        data: this.tracking
    }

    constructor() {
        this.markers = [];
        this.zoom = 3;
    }

    ngOnInit() {
        this.markers.push({
            position: {
                lat: 20.5937,
                lng: 78.9629
            },
            label: {
                color: "black",
                text: "India"
            },
            Option: {
                draggable: true,
                animation: google.maps.Animation.DROP,
            },
        });
    }
    //Street View
    @ViewChild(GoogleMap) map!: GoogleMap;
}
