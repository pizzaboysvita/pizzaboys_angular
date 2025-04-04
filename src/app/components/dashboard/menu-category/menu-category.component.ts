import { Component } from '@angular/core';
import { MenuCategory } from '../../../shared/data/dashboard';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-menu-category',
    imports: [ CarouselModule, RouterModule],
    templateUrl: './menu-category.component.html',
    styleUrl: './menu-category.component.scss'
})

export class MenuCategoryComponent {

  public MenuCategory = MenuCategory ;

  public customOptions: OwlOptions = {
    loop: true,
    dots: false,
    navSpeed: 700,
    navText: ['<div class="swiper-button-next categories-next"></div>', '<div class="swiper-button-prev categories-prev"></div>'],
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
        items: 8
      }
    },
    nav: true,
  }

}
