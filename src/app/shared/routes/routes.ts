import { Routes } from "@angular/router";

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
        path: 'restaurants',
        loadChildren: () => import('../../components/restaurants/restaurants.routes'),
    },


    {
        path: 'users',
        loadChildren: () => import('../../components/users/users.routes'),
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
    {
        path: 'options',
        loadChildren: () => import('../../components/optionset/options.routes'),
    },
    ///// customer Routes /////
    {
        path: 'bookings',
        loadChildren: () => import('../../components/bookings/booings.routes'),
    },
    {
        path: 'menus',
        loadChildren: () => import('../../components/menus/menus.routes'),
    },
    {
        path: 'settings',
        loadChildren: () => import('../../components/settings/settings.routes'),
    },
    {
        path: 'inventory',
        loadChildren: () => import('../../components/inventory/inventory/inventory.routes'),
    }

]
