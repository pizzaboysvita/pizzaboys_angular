import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface menuItem {
  level?: number;
  path?: string;
  title?: string;
  type?: string;
  icon?: string;
  active?: boolean;
  children?: menuItem[];
}

@Injectable({
  providedIn: 'root'
})

export class NavService {

  public collapseSidebar: boolean = window.innerWidth < 1200 ? true : false;
  constructor() { }

  // menuItem: menuItem[] = [
  //   {
  //     level: 1,
  //     title: "Dashboard",
  //     icon: "ri-home-line",
  //     path: "/dashboard",
  //     type: "link",
  //     active: true,
  //   },
  //   {
  //     level: 1,
  //     title: "Product",
  //     icon: "ri-store-3-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/product/products", title: "Products", type: "link", level: 2, },
  //       { path: "/product/add-new-products", title: "Add New Products", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Category",
  //     icon: "ri-bowl-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/category/category-list", title: "Category List", type: "link", level: 2, },
  //       { path: "/category/create-category", title: "Create Category", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Attributes",
  //     icon: "ri-list-settings-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/attributes/attributes", title: "Attributes", type: "link", level: 2, },
  //       { path: "/attributes/add-attributes", title: "Add Attributes", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Restaurants",
  //     path: "/restaurants/admin-settings",
  //     icon: "ri-shopping-bag-2-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Drivers",
  //     path: "/drivers",
  //     icon: "ri-car-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Foods",
  //     icon: "ri-bowl-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/foods/food-list", title: "Food List", type: "link", level: 2, },
  //       { path: "/foods/create-food", title: "Create Food", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Users",
  //     icon: "ri-user-3-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/users/all-users", title: "All users", type: "link", level: 2, },
  //       { path: "/users/add-new-user", title: "Add new user", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Roles",
  //     icon: "ri-group-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/roles/all-roles", title: "All Roles", type: "link", level: 2, },
  //       { path: "/roles/create-role", title: "Create Roles", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Media",
  //     path: "/media",
  //     icon: "ri-price-tag-3-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Live Tracking",
  //     path: "/live-tracking",
  //     icon: "ri-road-map-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Orders",
  //     icon: "ri-archive-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/orders/order-list", title: "Order List", type: "link", level: 2, },
  //       { path: "/orders/order-detail", title: "Order Detail", type: "link", level: 2, },
  //       { path: "/orders/order-tracking", title: "Order Tracking", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Localization",
  //     icon: "ri-focus-3-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/localization/translation", title: "Translation", type: "link", level: 2, },
  //       { path: "/localization/currency-rates", title: "Currency Rates", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Coupons",
  //     icon: "ri-coupon-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/coupons/coupon-list", title: "Coupon List", type: "link", level: 2, },
  //       { path: "/coupons/create-coupon", title: "Create Coupon", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Tax",
  //     path: "/tax",
  //     icon: "ri-price-tag-3-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Product Review",
  //     path: "/product-review",
  //     icon: "ri-star-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Support Ticket",
  //     path: "/support-ticket",
  //     icon: "ri-phone-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "Settings",
  //     icon: "ri-settings-line",
  //     type: "sub",
  //     active: false,
  //     children: [
  //       { path: "/settings/profile-setting/general", title: "Profile Setting", type: "link", level: 2, },
  //     ]
  //   },
  //   {
  //     level: 1,
  //     title: "Reports",
  //     path: "/reports",
  //     icon: "ri-file-chart-line",
  //     type: "link",
  //     active: false,
  //   },
  //   {
  //     level: 1,
  //     title: "List Page",
  //     path: "/list-page",
  //     icon: "ri-list-check",
  //     type: "link",
  //     active: false,
  //   },
  // ]
  menuItem: menuItem[] = [
       
    //    {
    //   level: 1,
    //   title: "Restaurants",
    //   icon: "ri-shopping-bag-2-line",
    //   type: "sub",
    //   active: true,
    //   children: [
    //     { path: "/restaurants/restaurants-list", title: "Restaurants", type: "link", level: 2, },
        
    //       {  path: "/restaurants/add-restaurants", title: "Add New Restaurants", type: "link", level: 2, },
    //   ]

      
    // },
    {
      level: 1,
      title: "Dashboard",
      path: "/dashboard",
      icon: "ri-file-chart-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title: "Restaurants",
      path: "/restaurants/restaurants-list",
      icon: "ri-shopping-bag-2-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title:  "Add New Restaurants",
      path: "/restaurants/add-restaurants", 
      icon: "ri-file-chart-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title:  "Staff",
      path: "/staff/staff-list", 
      icon: "ri-group-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title:  "Add Staff",
      path: "/staff/add-staff", 
      icon: "ri-user-3-line",
      type: "link",
      active: false,
    },
    //    {
    //   level: 1,
    //   title: "Users",
    //   icon: "ri-user-3-line",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/users/all-users", title: "All users", type: "link", level: 2, },
    //     { path: "/users/add-new-user", title: "Add new user", type: "link", level: 2, },
    //   ]
    // },
      {
      level: 1,
      title: "Reports",
      path: "/reports",
      icon: "ri-file-chart-line",
      type: "link",
      active: false,
    },
   
  ]
  customer_menu_items:menuItem[] =[
    {
      level: 1,
      title: "Dashboard",
        icon: "ri-home-line",
      path: "/dashboard",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title: "Reports",
      path: "/reports",
      icon: "ri-file-chart-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title: "Orders",
      path: "/orders/order-list",
      icon: "ri-archive-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title: "Bookings",
      path: "/bookings/bookings-list",
      icon: "ri-file-chart-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title: "Customers",
      path:"/users/all-users",
      icon: "ri-user-3-line",
      type: "link",
      active: false,
    },
   
    {
      level: 1,
      title: "Menus",
      path: "/drivers",
      icon: "ri-bowl-line",
      type: "link",
      active: false,
    },
    {
      level: 1,
      title: "Settings",
      path: "/users/add-new-user",
      icon: "ri-settings-line",
      type: "link",
      active: false,
    },
  ]
  pos_menu_items:menuItem[]  =[

    {
      level: 1,
      title: "Functions",
      icon: "ri-focus-3-line",
      type: "sub",
      active: false,
      children: [
        { path: "/localization/translation", title: "Limited Time Deal", type: "link", level: 2, },
        { path: "/localization/currency-rates", title: "Specials", type: "link", level: 2, },
        { path: "/coupons/create-coupon", title: "Lunch", type: "link", level: 2, },
      ]
    },
    {
      level: 1,
      title: "Menus",
      icon: "ri-coupon-line",
      type: "sub",
      active: true,
      children: [
        { path: "/orders/order-detail", title: "Coupon List", type: "link", level: 2, },
        { path: "/coupons/create-coupon", title: "Lunch", type: "link", level: 2, },
      ]
    },

    
   
   
  ]
  items = new BehaviorSubject<menuItem[]>(this.menuItem);

}
