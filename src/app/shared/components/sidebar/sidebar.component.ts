import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavService, menuItem } from '../../services/nav.service';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { filter } from 'rxjs';
import { ApisService } from '../../services/apis.service';

@Component({
    selector: 'app-sidebar',
    imports: [FeatherIconsComponent, CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  public menuItemsList :any
  titleToPermissionKey: { [key: string]: string } = {
  "Dashboard": "dashboard",
  "Orders":"orders_list_view",
  // "Orders": "orders_delete",
  "Bookings": "bookings",
  "Customers": "customers",
  "Menus": "menus",
  "Category": "menus_images",
  "Dish":"menus",
  "Reports":"reports",
  "Settings":"settings_systems",
  "Pos":'pos_orders'
};
  constructor(public navService: NavService,private sessionStorageService:SessionStorageService,
    private router: Router,private apis:ApisService
  ) {
    console.log(JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.role_id,'new Dateee')
  if(this.sessionStorageService.getsessionStorage('loginDetails') && JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.role_id ==1){
 this.menuItemsList= this.navService.superAdminmenuItem
    // this.menuItemsList= this.navService.customer_menu_items;
  }else{
   const permissionsFromApi= JSON.parse(JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.permissions)
     this.menuItemsList = this.navService.customer_menu_items.filter((item:any) => {
  const key = this.titleToPermissionKey[item.title];
  return key && permissionsFromApi[key];
});

console.log( this.menuItemsList )

  }
  // }else    if(JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).staff_id =='2'){
  //   this.menuItemsList= this.navService.pos_menu_items;
  // }else{
  //   this.menuItemsList= this.navService.superAdminmenuItem
  // }
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.menuItemsList.filter((items: any) => {
          if (items.path === event.url) {
            this.setNavActive(items);
          }
          if (!items.children) {
            return false;
          }
          items.children.filter((subItems: menuItem) => {
            if (subItems.path === event.url) {
              this.setNavActive(subItems);
            }
            return;
          });
          return;
        });
        
      }
    });
  }

  setNavActive(item: menuItem) {
    this.menuItemsList.filter((menuItem:any) => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter((submenuItems:any) => {
          if (submenuItems === item) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }
  toggleNavActive(item: menuItem) {
    console.log(item,'>>>>>>>>>> new items')
    if(item.title =='Pos'){
   this.sessionStorageService.setsessionStorage('Pos','true')
       this.apis.changesPos(true);
// location.reload()
this.router.navigate(["/orders/order-detail"]);
 setTimeout(() => {
    window.location.reload();
  }, 1000);
    }else{
    if (item.type === 'method' && item.methodName) {
      this.navService.logOut(); // ✅ dynamically call the method in NavService
    }
    else{
      if (!item.active) {
        this.menuItemsList.forEach((a: menuItem) => {
          if (this.menuItemsList.includes(item)) {
            a.active = false; 
          }
          if (!a.children) {
            return false;
          }
          a.children.forEach((b: menuItem) => {
            if (a.children?.includes(item)) {
              b.active = false;
            }
          });
          return;
        });
      }
    }
  
   
    if (item && item.title) {
      this.sessionStorageService.setSelectedMenuTitle(item.title || '');
      
    } else {
      console.error('Item has no title!');
    }
   

    item.active = !item.active;
  }
  }
  setActiveOnNavigation(url: string) {
    this.menuItemsList.forEach((item: any) => {
      if (item.path === url) {
        this.setNavActive(item);
      }
      if (item.children) {
        item.children.forEach((subItem: menuItem) => {
          if (subItem.path === url) {
            this.setNavActive(subItem);
          }
        });
      }
    });
  }

}
