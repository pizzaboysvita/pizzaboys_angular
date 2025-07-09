import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { AppConstants } from '../../../app.constants';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-dishs',
  imports: [NgbNavModule,NgSelectModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './add-dishs.component.html',
  styleUrl: './add-dishs.component.scss'
})
export class AddDishsComponent {

 active=1
 public menuList =[
  { id: 1, name: 'TakeWay Menu' },
  { id: 2, name: 'Seasonal menu' },
  {
    id:3, name:'Cycle menu'
  }
 ]
   public PlaceholderSubcategory = [
    { id: 1, name: 'Subcategory Menu', price:'20' },
    { id: 2, name: 'Ethnic Wear', price:'30' },
    { id: 3, name: 'Ethnic Bottoms' , price:'40' },
    { id: 4, name: 'Women Western Wear', price:'50' },
    { id: 5, name: 'Sandels' , price:'60'},
    { id: 6, name: 'Shoes' , price:'60'},
    { id: 7, name: 'Beauty & Grooming' , price:'60'},
  ]
  // public categoryList=[
  //   { id: 1, name: 'Valentines Day Promotion' },
  //   { id: 2, name: 'Limited Time Deal' },
  //   { id: 3, name: 'Specials' },
  //   { id: 4, name: 'Lunch' },
  //    { id: 5, name: 'Chicken Pizza' },
  //    { id: 6, name: 'Meat Pizza' },
  // ]
  menuForm!: FormGroup;
  menuItemsList: any = []
  categoryList:any = []
  optSetDetails: any;
  storesList: any;
// choices: {
//   name: string;
//   expanded: boolean;
//   takeawayExpanded: boolean;
//   subcategories: {
//     name: string;
//     checked: boolean;
//     expanded?: boolean;
//     subSubcategories?: {
//       name: string;
//       checked: boolean;
//     }[];
//   }[];
// }[] = [];
choices: any[] = [];
currentMenuIndex = 0;
rawMenus: any[];
addedMenuIds: Set<number> = new Set();
  constructor(private fb: FormBuilder,public modal: NgbModal, private apiService: ApisService, private sessionStorage: SessionStorageService) {}

  ngOnInit() {
    this.menuForm = this.fb.group({
      menuType: [null],
      categoryType: [null],
      dishType: ['standard'], // Default selected
      firstName: [''],
      price: [''],
      priceSuffix: [''],
      displayName: [''],
      printName: [''],
      posName: [''],
      description: [''],
      subtitle: [''],
      storeName:[null]
      
    });
    this.storeList()
    this.getOptionSets()
    this.getmenuList();
    this.getMenuCategoryDishData()
  }
    menuItems = [
    { name: 'Takeaway Menu' },
    { name: 'Pizza of the Week' },
    { name: 'Limited Time Deal' },
  ];
    storeList() {
    this.apiService
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.storesList = data;
        }
      });

  }
    getMenuCategoryDishData() {
    const userId = JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id;
  
    const menuApi = this.apiService.getApi(AppConstants.api_end_points.menu + '?user_id=' + userId);
    const categoryApi = this.apiService.getApi(`/api/category?user_id=` + userId);
    const dishApi = this.apiService.getApi(AppConstants.api_end_points.dish + '?user_id=' + userId);
  
    forkJoin([menuApi, categoryApi, dishApi]).subscribe(
      ([menuRes, categoryRes, dishRes]: any) => {
const resi=this.apiService.buildMenuTree(menuRes.data,categoryRes.categories,dishRes.data)
this.rawMenus=resi
console.log(resi,"resi");

        // this.selectedMenuId=this.menuList[0]
        
        // this.totalcategoryList=categoryRes.categories
        // this.totalDishList=dishRes.data
        // this.menuType_cat(this.menuList[0])
      // this.totalmenuDetails=this.apiService.buildMenuTree(menuRes.data,categoryRes.categories,dishRes.data)
      // console.log(this.totalmenuDetails)
    
      })
    }
    getmenuList() {
  
      this.apiService.getApi(AppConstants.api_end_points.menu + '?user_id=' + JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
        if (data) {
          console.log(data)
          this.menuItemsList=  data.data.filter((x: {  status: number; })=>(x.status==1))
  
        }
      })
    }
      getOptionSets() {
   
    this.apiService.getApi('/api/optionset?user_id=' + JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
      if (data.code==1) {
        console.log(data, 'optionnnnnnnn')
         data.data.forEach((item:any)=>{
          item.status=item.status ==1?'Active':item.status ==0?'Inactive':'--'
         })
        this.optSetDetails = data.data
      }
    })
  }
        getCategories(data:any): void {
          console.log(data.dish_menu_id);
          
    const loginRaw = this.sessionStorage.getsessionStorage("loginDetails");
    const loginData = loginRaw ? JSON.parse(loginRaw) : null;
    const userId = loginData?.user?.user_id;
    console.log(userId, 'user id');
    

    if (!userId) {
      console.error("No user ID found in session");
      return;
    }

    this.apiService
      .getApi(`/api/category?user_id=${userId}`)
      .subscribe((res: any) => {

        console.log(res, 'categories response');
        
        if (res.code === "1") {
          this.categoryList=  res.categories.filter((x: { dish_menu_id: any; status: number; })=>(x.dish_menu_id== data.dish_menu_id && x.status==1))

          
        } else {
          console.error("Failed to load categories:", res.message);
        }
      });
  }


// addChoice() {
  // const nextIndex = this.choices.length + 1;
  // this.choices.push({
  //   name: `Takeaway Menu ${nextIndex}`,
  //   expanded: false,
  //   takeawayExpanded: false,
  //   subcategories: [
  //     {
  //       name: 'Pizza of the Week',
  //       checked: false,
  //       expanded: false,
  //       subSubcategories: [
  //         { name: 'Monday Special', checked: false },
  //         { name: 'Tuesday Treat', checked: false }
  //       ]
  //     },
  //     {
  //       name: 'Limited Time Deal',
  //       checked: false,
  //       expanded: false,
  //       subSubcategories: [
  //         { name: 'BOGO Offer', checked: false },
  //         { name: 'Flash Sale', checked: false }
  //       ]
  //     },
  //     {
  //       name: 'Chicken Wings Special',
  //       checked: false,
  //       expanded: false,
  //       subSubcategories: []
  //     },
  //     { name: 'Specials', checked: false, expanded: false },
  //     { name: 'Lunch', checked: false, expanded: false },
  //     { name: 'Classic Range Pizzas', checked: false, expanded: false },
  //     { name: 'Vegetarian Pizzas', checked: false, expanded: false },
  //     { name: 'Chicken Pizzas', checked: false, expanded: false },
  //     { name: 'Meat Pizzas', checked: false, expanded: false },
  //     { name: 'Seafood Pizzas', checked: false, expanded: false },
  //     { name: 'Standard Sides', checked: false, expanded: false },
  //     { name: 'Classic Sides', checked: false, expanded: false },
  //     { name: 'Signature Sides', checked: false, expanded: false }
  //   ]
  // });
// }


addChoice() {
  const nextMenu = this.rawMenus.find(menu => !this.addedMenuIds.has(menu.menuId));
  if (!nextMenu) {
    console.warn("No more menus to add.");
    return;
  }

  const newChoice = {
    menuId: nextMenu.menuId,
    name: nextMenu.menuName,
    expanded: false,
    takeawayExpanded: false,
    subcategories: nextMenu.categories.map((category: { categoryName: any; dishes: any[]; }) => ({
      name: category.categoryName,
      checked: false,
      expanded: false,
      subSubcategories: category.dishes?.map(dish => ({
        name: dish.dishName,
        checked: false,
        image_url: dish.image_url
      })) || []
    }))
  };

  this.choices.push(newChoice);
  this.addedMenuIds.add(nextMenu.menuId);
}

onChoiceToggle(choice: any) {
  const isChecked = choice.checked;

  for (let sub of choice.subcategories) {
    sub.checked = isChecked;

    if (sub.subSubcategories && sub.subSubcategories.length > 0) {
      for (let subsub of sub.subSubcategories) {
        subsub.checked = isChecked;
      }
    }
  }
}
onSubcategoryToggle(sub: any) {
  const isChecked = sub.checked;

  if (sub.subSubcategories && sub.subSubcategories.length > 0) {
    for (let subsub of sub.subSubcategories) {
      subsub.checked = isChecked;
    }
  }
}

toggleExpand(index: number) {
  this.choices[index].expanded = !this.choices[index].expanded;
}

// removeChoice(index: number) {
//   this.choices.splice(index, 1);
// }
removeChoice(index: number) {
  const removedMenuId = this.choices[index].menuId;
  this.choices.splice(index, 1);
  this.addedMenuIds.delete(removedMenuId);  // Allow it to be added again
}

Ingredients: {name:string}[]=[];

addIngredients() {
  this.Ingredients.push({ name: '' });
}

removeIngredients(index: number) {
  this.Ingredients.splice(index, 1);
}
selectedSubcategories: number[] = [];

dish_option_set_json: string = '';

onSubcategoryChange(selectedIds: number[]) {
  // const selectedOptions = this.optSetDetails
  //   .filter(item => selectedIds.includes(item.id))
  //   .map(item => ({
  //     option: item.name,
  //     price: Number(item.price)
  //   }));

  // this.dish_option_set_json = JSON.stringify(selectedOptions);
  console.log('dish_option_set_json:', this.dish_option_set_json);
}
insertDishData(){
console.log("innnnnnnnnnnnn", this.Ingredients, this.selectedSubcategories)
const reqbody={
    "type": "insert",
    "dish_menu_id": this.menuForm.value.menuType,
    "dish_category_id": this.menuForm.value.categoryType,
    "dish_type": this.menuForm.value.dishType,
    "dish_name": this.menuForm.value.firstName,
    "dish_price": this.menuForm.value.price,
    "price_pickup": 240,
    "price_delivery": 260,
    "price_dine_in": 250,
    "price_suffix":this.menuForm.value.priceSuffix,
    "display_name": this.menuForm.value.firstName,
    "print_name":this.menuForm.value.printName,
    "pos_name": this.menuForm.value.posName,
    "description":this.menuForm.value.description,
    "subtitle": this.menuForm.value.subtitle,
    "store_id":this.menuForm.value.storeName,
    // "created_by": 1,
    "dish_option_set_json": JSON.stringify(this.selectedSubcategories as any),
    "dish_ingredients_json": JSON.stringify(this.Ingredients.map(i => i.name) as any),
    "dish_choices_json": "[{\"choice\":\"Spice Level\",\"values\":[\"Mild\",\"Medium\",\"Hot\"]}]"
}
console.log(reqbody)
    this.apiService.postApi(AppConstants.api_end_points.dish, reqbody).subscribe((res: any) => {
      if (res.code === "1") {
        alert("Dish added successfully");
        this.modal.dismissAll("refresh");
      } else {
        alert(res.message || "Failed to add Dish");
      }
    });
  }

}