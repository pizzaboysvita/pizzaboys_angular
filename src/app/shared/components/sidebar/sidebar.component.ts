import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavService, menuItem } from '../../services/nav.service';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';

@Component({
    selector: 'app-sidebar',
    imports: [FeatherIconsComponent, CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  public menuItemsList :any

  constructor(public navService: NavService,
    private router: Router,
  ) {
  console.log(JSON.parse(localStorage.getItem('user') as any).name,'openn')
  if(JSON.parse(localStorage.getItem('user') as any).name =='customer'){
this.menuItemsList= this.navService.customer_menu_items;
  }else  if(JSON.parse(localStorage.getItem('user') as any).name =='pos'){
    this.menuItemsList= this.navService.pos_menu_items;
  }else{
    this.menuItemsList= this.navService.menuItem
  }
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
    item.active = !item.active;
  }

}
