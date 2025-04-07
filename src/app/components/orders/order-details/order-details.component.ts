import { Component, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DetailsComponent } from "./details/details.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { MediaComponent } from '../../media/media.component';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.scss',
    imports: [NgbNavModule, OrderStatusComponent, DetailsComponent,MediaComponent,
         GoogleMapsModule]
})

export class OrderDetailsComponent {

  public active = 1;
  public markers: any[];
  public zoom: number;

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
