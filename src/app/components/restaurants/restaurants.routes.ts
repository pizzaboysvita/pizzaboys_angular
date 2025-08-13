import { Routes } from "@angular/router";
import { HoursOfWorkingComponent } from "./hours-of-working/hours-of-working.component";
import { ImageGalleryComponent } from "./image-gallery/image-gallery.component";
import { RestaurantInfoComponent } from "./restaurant-info/restaurant-info.component";
import { RestaurantsComponent } from "./restaurants.component";
import { ServiceComponent } from "./service/service.component";
import { AddRestaurantsComponent } from "./add-restaurants/add-restaurants.component";
import { RestaurantsListComponent } from "./restaurants-list/restaurants-list.component";
import { ViewRestaurantsComponent } from "./view-restaurants/view-restaurants.component";

export default [
    {
        path: '',
        component: RestaurantsComponent,
        children: [
           
           
            {
                path: 'restaurant-info',
                component: RestaurantInfoComponent,
            },
            {
                path: 'image-gallery',
                component: ImageGalleryComponent,
            },
            {
                path: 'service',
                component: ServiceComponent,
            },
            {
                path: 'hours-of-working',
                component: HoursOfWorkingComponent,
            },
           
        ]
    },
    {
        path:'add-restaurants',
        component:AddRestaurantsComponent
    },
    {
        path:'restaurants-list',
        component:RestaurantsListComponent
    },
    {
        path:'restaurants-view',
        component:ViewRestaurantsComponent
    }
] as Routes;
