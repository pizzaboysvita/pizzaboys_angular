import { Routes } from "@angular/router";
import { ActiveInactiveComponent } from "./active-inactive/active-inactive.component";
import { AdminSettingsComponent } from "./admin-settings/admin-settings.component";
import { DeliveryChargeComponent } from "./delivery-charge/delivery-charge.component";
import { FeatureSettingComponent } from "./feature-setting/feature-setting.component";
import { HoursOfWorkingComponent } from "./hours-of-working/hours-of-working.component";
import { ImageGalleryComponent } from "./image-gallery/image-gallery.component";
import { RestaurantInfoComponent } from "./restaurant-info/restaurant-info.component";
import { RestaurantsComponent } from "./restaurants.component";
import { ServiceComponent } from "./service/service.component";
import { SpecialOfferComponent } from "./special-offer/special-offer.component";
import { AddRestaurantsComponent } from "./add-restaurants/add-restaurants.component";
import { RestaurantsListComponent } from "./restaurants-list/restaurants-list.component";
import { ViewRestaurantsComponent } from "./view-restaurants/view-restaurants.component";

export default [
    {
        path: '',
        component: RestaurantsComponent,
        children: [
           
            {
                path: 'admin-settings',
                component: AdminSettingsComponent,
            },
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
            {
                path: 'active-inactive',
                component: ActiveInactiveComponent,
            },
            {
                path: 'feature-setting',
                component: FeatureSettingComponent,
            },
            {
                path: 'delivery-charge',
                component: DeliveryChargeComponent,
            },
            {
                path: 'special-offer',
                component: SpecialOfferComponent,
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
