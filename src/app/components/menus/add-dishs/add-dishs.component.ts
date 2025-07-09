import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { AppConstants } from '../../../app.constants';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-dishs',
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-dishs.component.html',
  styleUrl: './add-dishs.component.scss'
})
export class AddDishsComponent {
  active = 1
  menuForm!: FormGroup;
  menuItemsList: any = []
  categoryList: any = []
  optSetDetails: any;
  storesList: any;
  Ingredients: { name: string }[] = [];
  choices: any[] = [];
  currentMenuIndex = 0;
  rawMenus: any[];
  addedMenuIds: Set<number> = new Set();
  mainMenuItems: any[];
  selectedSubcategories: number[] = [];
  dish_option_set_json: string = '';
  constructor(private fb: FormBuilder, public modal: NgbModal, private router: Router, private apiService: ApisService, private sessionStorage: SessionStorageService) { }

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
      storeName: [null]

    });
    this.storeList()
    this.getOptionSets()
    this.getMenuCategoryDishData()
  }
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
        this.menuItemsList = menuRes.data
        this.categoryList = categoryRes.categories
        const resi = this.apiService.buildMenuTree(menuRes.data, categoryRes.categories, dishRes.data)
        this.mainMenuItems = resi
        console.log(resi, "resi");

      })
  }

  getOptionSets() {

    this.apiService.getApi('/api/optionset?user_id=' + JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
      if (data.code == 1) {
        console.log(data, 'optionnnnnnnn')
        data.data.forEach((item: any) => {
          item.status = item.status == 1 ? 'Active' : item.status == 0 ? 'Inactive' : '--'
        })
        this.optSetDetails = data.data
      }
    })
  }
  getCategories(data: any): void {
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
          this.categoryList = res.categories.filter((x: { dish_menu_id: any; status: number; }) => (x.dish_menu_id == data.dish_menu_id && x.status == 1))


        } else {
          console.error("Failed to load categories:", res.message);
        }
      });
  }
  addChoice() {
    const nextIndex = this.choices.length + 1;
    this.choices.push({
      expanded: false,
      name: '',
      menuItems: JSON.parse(JSON.stringify(this.mainMenuItems))  // Deep clone
    });
  }
  onChoiceToggle(choice: any) {
    console.log(choice)
    const isChecked = choice.checked;

    for (let sub of choice.categories) {
      sub.checked = isChecked;

      if (sub.dishes && sub.dishes.length > 0) {
        for (let subsub of sub.dishes) {
          subsub.checked = isChecked;
        }
      }
    }
  }
  onSubcategoryToggle(sub: any) {
    console.log(sub)
    const isChecked = sub.checked;

    if (sub.dishes && sub.dishes.length > 0) {
      for (let subsub of sub.dishes) {
        subsub.checked = isChecked;
      }
    }
  }
  toggleExpand(index: number) {
    this.choices[index].expanded = !this.choices[index].expanded;
  }
  removeChoice(index: number) {
    const removedMenuId = this.choices[index].menuId;
    this.choices.splice(index, 1);
    this.addedMenuIds.delete(removedMenuId);  // Allow it to be added again
  }
  addIngredients() {
    this.Ingredients.push({ name: '' });
  }
  removeIngredients(index: number) {
    this.Ingredients.splice(index, 1);
  }
  insertDishData() {
    console.log("innnnnnnnnnnnn", this.Ingredients, this.selectedSubcategories, this.choices)
    const reqbody = {
      "type": "insert",
      "dish_menu_id": this.menuForm.value.menuType,
      "dish_category_id": this.menuForm.value.categoryType,
      "dish_type": this.menuForm.value.dishType,
      "dish_name": this.menuForm.value.firstName,
      "dish_price": this.menuForm.value.price,
      "price_pickup": 240,
      "price_delivery": 260,
      "price_dine_in": 250,
      "price_suffix": this.menuForm.value.priceSuffix,
      "display_name": this.menuForm.value.firstName,
      "print_name": this.menuForm.value.printName,
      "pos_name": this.menuForm.value.posName,
      "description": this.menuForm.value.description,
      "subtitle": this.menuForm.value.subtitle,
      "store_id": this.menuForm.value.storeName,
      // "created_by": 1,
      "dish_option_set_json": JSON.stringify(this.selectedSubcategories as any),
      "dish_ingredients_json": JSON.stringify(this.Ingredients.map(i => i.name) as any),
      "dish_choices_json": "[{\"choice\":\"Spice Level\",\"values\":[\"Mild\",\"Medium\",\"Hot\"]}]"
    }
    console.log(reqbody)
    this.apiService.postApi(AppConstants.api_end_points.dish, reqbody).subscribe((res: any) => {
      if (res.code === "1") {
        Swal.fire("Success!", res.message, "success").then((result) => {
          if (result) {
            console.log("User clicked OK");
            this.router.navigate(["/menus/dish"]);
          }
        });
        this.modal.dismissAll("refresh");
      } else {
        alert(res.message || "Failed to add Dish");
      }
    });
  }

}