import { Routes } from '@angular/router';

export const content: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../components/dashboard/dashboard.routes'),
    },
    {
        path: 'store-dashboard',
        loadChildren: () => import('../../components/store-dashboard/store-dashboard.routes'),
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
        path: 'restaurants',
        loadChildren: () => import('../../components/restaurants/restaurants.routes'),
    },
    {
        path: 'drivers',
        loadChildren: () => import('../../components/drivers/drivers.routes'),
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
        path: 'orders',
        loadChildren: () => import('../../components/orders/orders.routes'),
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
        path: 'staff',
        loadChildren: () => import('../../components/staff/staff.routes'),
    },
    ///// customer Routes /////
    {
        path: 'bookings',
        loadChildren: () => import('../../components/bookings/booings.routes'),
    },
    {
        path: 'menus',
        loadChildren: () => import('../../components/menus/menus.routes'),
    }
]