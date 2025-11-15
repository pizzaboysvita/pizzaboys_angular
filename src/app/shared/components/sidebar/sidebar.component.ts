import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavService, menuItem } from '../../services/nav.service';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { filter, forkJoin } from 'rxjs';
import { ApisService } from '../../services/apis.service';
import { AppConstants } from '../../../app.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingOutComponent } from '../widgets/logging-out/logging-out.component';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-sidebar',
    imports: [FeatherIconsComponent, CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  @Output() dishesSelected = new EventEmitter<any[]>(); // 👈 send dishes
  public menuItemsList :any
    totalDishList: any[];
    selectedCategory: any;
    categoriesList: any[] = [];
    dishList: DishFromAPI[] = [];
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
  pos: any;
    currentTime: string = '';
  showFunctionsMenu: boolean;
  isSidebarOpen: boolean=true;
  constructor( private CommonService: CommonService,public modal: NgbModal,public navService: NavService,private sessionStorageService:SessionStorageService,
    private cdr: ChangeDetectorRef,
    private router: Router,private apis:ApisService
  ) {
    
  }
ngOnInit(){
      // this.pos=this.sessionStorageService.getsessionStorage('Pos')
      console.log(JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.role_id,'new Dateee')
  if(this.sessionStorageService.getsessionStorage('loginDetails') && JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.role_id ==1){
 this.menuItemsList= this.navService.superAdminmenuItem
    // this.menuItemsList= this.navService.customer_menu_items;
  }
  else if(this.sessionStorageService.getsessionStorage('loginDetails') && JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.role_id ==3){
   this.pos=this.sessionStorageService.getsessionStorage('loginDetails') && JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.role_id
    this.getDishslist();
      this.updateTime();
    setInterval(() => this.updateTime(), 60000);
  }
  else{
   const permissionsFromApi= JSON.parse(JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.permissions)
     this.menuItemsList = this.navService.customer_menu_items


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

  getDishslist() {
    this.menuItemsList=[]
    const storeId = JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.store_id;


    const categoryApi = this.apis.getApi(
      `/api/category?store_id=` + storeId
    );
    const dishApi = this.apis.getApi(
      AppConstants.api_end_points.dish + "?store_id=" + storeId
    );


    forkJoin([categoryApi, dishApi]).subscribe(
      ([categoryRes, dishRes]: any) => {
        console.log("Category API Response:", categoryRes);
        console.log("Dish API Response:", dishRes);
        // console.log("Combo Dish API Response:", comboDishRes);

        const processedMenu = this.apis.posMenuTree(
          categoryRes.categories,
          dishRes.data
        );
        console.log("Processed Menu:", processedMenu);
        this.categoriesList = processedMenu.filter(x=>(x.hide_category_in_POS == 0));
        this.categoriesList.unshift({ name: 'Limited Time Deal' });
        this.totalDishList = dishRes.data;
        if (this.categoriesList && this.categoriesList.length > 0) {
          this.selectedCategory = this.categoriesList[0];
          console.log( this.selectedCategory, "this.selectedCategory");
          
          this.selectCategory(this.selectedCategory)
          // this.dishList = this.selectedCategory.dishes;
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching dish list or categories:", error);
      }
    );
  }
 
   selectCategory(category: any) {

     this.CommonService.setTotalDishList( this.totalDishList)
     if(category.name=='Limited Time Deal'){
       this.CommonService.setDishes(this.totalDishList.filter(x=>(x.dish_type== "combo")));
    }
    else{
       this.dishList = category.dishes;
    this.selectedCategory = category;
    //  this.dishesSelected.emit(this.dishList)
     this.CommonService.setDishes(this.dishList);
    
    }
    this.cdr.detectChanges();

  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  toggleFunctionsMenu() {
    this.showFunctionsMenu = !this.showFunctionsMenu;
  }
  logOut() {
         this.modal.open(LoggingOutComponent,{
             windowClass:'theme-modal',centered:true
         })
     }

}
export interface DishFromAPI {
  dish_id: number;
  dish_menu_id: number;
  dish_category_id: number;
  dish_type: string;
  dish_name: string;
  dish_price: string;
  dish_image: string;
  status: string | number;
  description?: string;
  notes?: string;
  dish_ingredients_json?: string;
  dish_option_set_json?: string;
  category_name?: string;
  quantity?: number;
  [key: string]: any;
}
