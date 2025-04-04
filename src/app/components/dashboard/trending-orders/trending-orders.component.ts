import { Component } from '@angular/core';
import { TrendingOrders } from '../../../shared/data/dashboard';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CardComponent } from "../../../shared/components/card/card.component";
import { RouterModule } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-trending-orders',
    templateUrl: './trending-orders.component.html',
    styleUrl: './trending-orders.component.scss',
    imports: [CarouselModule, CardComponent, RouterModule, NgbRatingModule]
})

export class TrendingOrdersComponent {

  public TrendingOrders = TrendingOrders;
  public customOptions: OwlOptions = {
    loop: true,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 5
      }
    },
    nav: false
  }
}
