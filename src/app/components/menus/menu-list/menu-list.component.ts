import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { media, MediaLibrary } from '../../../shared/data/media';
import { AddMediaComponent } from '../../media/add-media/add-media.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddDishsComponent } from '../add-dishs/add-dishs.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddMenuModalComponent } from '../add-menu-modal/add-menu-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionStatusComponent } from './action-status/action-status.component';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { ApisService } from '../../../shared/services/apis.service';
import { AppConstants } from '../../../app.constants';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-list',
  imports: [CardComponent,NgSelectModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent {
    @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  selectedTabIndex = 0;
  menuItemsList: any;
  getCategories: any;
  totalmenuDetails: any[];
  categoryList: any;
  dishList: any=[];
  menuList: any;
  totalcategoryList: any;
  totalDishList: any;
  modelRef: any;
  dishDetails: any;
constructor(
    public modal: NgbModal,
    private apiService: ApisService,private modalService: NgbModal, 
    private sessionStorage: SessionStorageService
  ) {}
  public MediaLibrary = MediaLibrary;
  selectedMenuId = {}; // Default selected menu
  // menuList = [
  //   { id: 1, name: 'TakeWay Menu' },
  //   { id: 2, name: 'Seasonal menu' },
  //   { id: 3, name: 'Cycle menu' }
  // ];
  
  // Tab data grouped by menu ID
  tabsData: { [key: string]: { label: string; icon: string }[] } = {
    '1': [
      { label: 'Lunch', icon: 'ri-settings-line' },
      { label: 'Chicken Pizzas', icon: 'ri-radio-button-line' },
    ],
    '2': [
      { label: 'Seafood Pizzas', icon: 'ri-wallet-line' },
      { label: 'Vegan Pizzas', icon: 'ri-plant-line' },
    ],
    '3': [
      { label: 'Weekly Special', icon: 'ri-calendar-line' }
    ]
  }
  
  get tabs() {
    return this.tabsData[this.selectedMenuId.toString()] || [];
  }
 



   insertDish() {
      this.modelRef=this.modal.open(AddDishsComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
      this.modelRef.result.then(
  (result:any) => {
    this.getMenuCategoryDishData()
  })
    }
    insertCategory() {
      this.modal.open(AddCategoryComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
    }
     insertMenu(){
              this.modal.open(AddMenuModalComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
        }
        openPopup(): void {
          // Remove focus from dropdown item (important!)
          // (document.activeElement as HTMLElement)?.blur();
      
          const modalRef = this.modal.open(ActionStatusComponent, {
            centered: true,
          
          });
      
          modalRef.result.then(
            (result) => {
              console.log('Modal closed with:', result);
            },
            () => {
              console.log('Modal dismissed');
            }
          );
        }
      
ngOnInit(): void {
    this.getMenuCategoryDishData()

  
  }
  getMenuCategoryDishData() {
  const userId = JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id;

  const menuApi = this.apiService.getApi(AppConstants.api_end_points.menu + '?user_id=' + userId);
  const categoryApi = this.apiService.getApi(`/api/category?user_id=` + userId);
  const dishApi = this.apiService.getApi(AppConstants.api_end_points.dish + '?user_id=' + userId);

  forkJoin([menuApi, categoryApi, dishApi]).subscribe(
    ([menuRes, categoryRes, dishRes]: any) => {
dishRes.data.forEach((elemet:any)=>{
  elemet.image_url='assets/pizzaImg/menus/3.png'
})
      console.log(menuRes.data,categoryRes,dishRes)
      this.menuList=menuRes.data
      console.log(this.menuList[0])
      this.selectedMenuId=this.menuList[0]
      
      this.totalcategoryList=categoryRes.categories
      this.totalDishList=dishRes.data
      this.menuType_cat(this.menuList[0])
    // this.totalmenuDetails=this.apiService.buildMenuTree(menuRes.data,categoryRes.categories,dishRes.data)
    // console.log(this.totalmenuDetails)
  
    })
  }
  menuType_cat(data:any){
    // console.log(data,this.selectedMenuId)
    this.selectedTabIndex=0
    this.categoryList=this.totalcategoryList.filter((cat:any) => cat.dish_menu_id == data.dish_menu_id);
    console.log(this.categoryList)
    this.category_dish(this.categoryList[0])

  }
  category_dish(category:any){
    console.log(category,this.totalDishList,'ttall')
    this.dishList=[]
   this.dishList= this.totalDishList.filter((dish:any)=>dish.dish_category_id ==category.id && dish.dish_menu_id ==category.dish_menu_id)
   console.log(this.dishList,'ttall')
  }
    open(data: any) {
    this.dishList.forEach((item :any) => {
      if (data.dish_id === item.dish_id) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
    });
  }
  dishDelete(data:any){
    this.dishDetails=data
 this.modelRef=this.modalService.open(this.confirmModalRef, {
      centered: true,
      backdrop: 'static'
    });
  }
  onConfirm(data:any){
const reqboy={
  "type": "delete",
  "dish_id":this.dishDetails.dish_id
}
this.apiService.postApi(AppConstants.api_end_points.dish,reqboy).subscribe((data:any)=>{
  if(data.code ==1){
      this.modelRef.close();
                        Swal.fire({
                          title: 'Success!',
                          text: data.message,
                          icon: 'success',
                          width: '350px',  // customize width (default ~ 600px)
                        }).then((result) => {
                          if (result.isConfirmed) {
                            console.log('User clicked OK');
                            this.getMenuCategoryDishData();
                          }
                        });
  }
})

  }
//    getmenuList() {
    
//         this.apiService.getApi(AppConstants.api_end_points.menu + '?user_id=' + JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
//           if (data) {
//             console.log(data)
//             this.menuItemsList=  data.data.filter((x: {  status: number; })=>(x.status==1))
//     this.fetchCategories()
//           }
//         })
//       }

//           fetchCategories(): void {
    

//     this.apiService
//       .getApi(`/api/category?user_id=$`+JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id)
//       .subscribe((res: any) => {

//         console.log(res, 'categories response');
        
//         if (res.code === "1") {
//               res.categories.forEach((categorie:any)=>{
//                 categorie.status =  categorie.status==0?'Hide': categorie.status==1?'Active':'--';
//                 categorie.hide_category_in_POS= categorie.hide_category_in_POS=1?'Hide in POS': categorie.hide_category_in_POS==0?'Show in POS':'--'
//               })
//           this.getCategories = res.categories
// this.getDish()
          
//         } else {
//           console.error("Failed to load categories:", res.message);
//         }
//       });
//   }
//   getDish(){
//     this.apiService.getApi(AppConstants.api_end_points.dish + '?user_id=' + JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
//     if(data){}
//     })

//   }
}
