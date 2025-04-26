import { Routes } from '@angular/router';

export const content: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../components/dashboard/dashboard.routes'),
    },
    {
        path: 'product',
        loadChildren: () => import('../../components/product/product.routes'),
    },
    {
        path: 'category',
        loadChildren: () => import('../../components/category/category.routes'),
    },
    {
        path: 'attributes',
        loadChildren: () => import('../../components/attributes/attributes.routes'),
    },
    {
        path: 'restaurants',
        loadChildren: () => import('../../components/restaurants/restaurants.routes'),
    },
    {
        path: 'drivers',
        loadChildren: () => import('../../components/drivers/drivers.routes'),
    },
    {
        path: 'foods',
        loadChildren: () => import('../../components/food/food.routes'),
    },
    {
        path: 'users',
        loadChildren: () => import('../../components/users/users.routes'),
    },
    {
        path: 'roles',
        loadChildren: () => import('../../components/roles/roles.routes'),
    },
    {
        path: 'media',
        loadChildren: () => import('../../components/media/media.routes'),
    },
    {
        path: 'live-tracking',
        loadChildren: () => import('../../components/live-tracking/live-tracking.routes'),
    },
    {
        path: 'orders',
        loadChildren: () => import('../../components/orders/orders.routes'),
    },
    {
        path: 'localization',
        loadChildren: () => import('../../components/localization/localization.routes'),
    },
    {
        path: 'coupons',
        loadChildren: () => import('../../components/coupons/coupons.routes'),
    },
    {
        path: 'tax',
        loadChildren: () => import('../../components/tax/tax.routes'),
    },
    {
        path: 'product-review',
        loadChildren: () => import('../../components/product-review/product-review.routes'),
    },
    {
        path: 'support-ticket',
        loadChildren: () => import('../../components/support-ticket/support-ticket.routes'),
    },
    {
        path: 'settings/profile-setting',
        loadChildren: () => import('../../components/setting/setting.routes'),
    },
    {
        path: 'reports',
        loadChildren: () => import('../../components/reports/reports.routes'),
    },
    {
        path: 'list-page',
        loadChildren: () => import('../../components/list-page/list-page.routes'),
    },
    {
        path: 'staff',
        loadChildren: () => import('../../components/staff/staff.routes'),
    },
    ///// customer Routes /////
    {
        path: 'bookings',
        loadChildren: () => import('../../components/bookings/booings.routes'),
    }
]