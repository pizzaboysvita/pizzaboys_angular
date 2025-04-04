import { Routes } from "@angular/router";
import { CouponListComponent } from "./coupon-list/coupon-list.component";
import { CreateCouponComponent } from "./create-coupon/create-coupon.component";

export default [
    {
        path: 'coupon-list',
        component: CouponListComponent
    },
    {
        path: 'create-coupon',
        component: CreateCouponComponent
    }
] as Routes;