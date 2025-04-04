import { Routes } from "@angular/router";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderTrackingComponent } from "./order-tracking/order-tracking.component";

export default [
    {
        path: 'order-list',
        component: OrderListComponent
    },
    {
        path: 'order-detail',
        component: OrderDetailsComponent
    },
    {
        path: 'order-tracking',
        component: OrderTrackingComponent
    },
] as Routes