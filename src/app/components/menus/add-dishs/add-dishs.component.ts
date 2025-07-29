import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  @Input() type: any
  @Input() myData: any;
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
  reqbody: any
  uploadImagUrl: string | ArrayBuffer | null;
  file: File;
  constructor(private fb: FormBuilder, public modal: NgbModal, private router: Router, private apiService: ApisService, private sessionStorage: SessionStorageService) { }

  ngOnInit() {
    this.menuForm = this.fb.group({
      menuType: [null, Validators.required],
      categoryType: [null, Validators.required],
      dishType: ['standard'], // Default selected
      firstName: ['', Validators.required],
      image: [null, Validators.required],
      price: [''],
      priceSuffix: [''],
      displayName: [''],
      printName: [''],
      posName: [''],
      description: [''],
      // optionSet:[''],
      subtitle: [''],
      storeName: [null, Validators.required]

    });
    this.storeList()
    this.getOptionSets()
    this.getMenuCategoryDishData()
    this.patchValue()
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
  patchValue() {
    this.getMenuCategoryDishData()

    console.log(this.myData, this.type, 'opennnnnnnnnnnnn')
    if (this.type == 'Edit' || this.type == 'View') {
      this.menuForm.get('image')?.clearValidators();
this.menuForm.get('image')?.updateValueAndValidity();
      this.menuForm.patchValue({
        menuType: this.myData.dish_menu_id,
        categoryType: this.myData.dish_category_id,
        dishType: this.myData.dish_type, // Default selected
        firstName: this.myData.dish_name,
        price: this.myData.dish_price,
        priceSuffix: this.myData.price_suffix,
        displayName: this.myData.display_name,
        printName: this.myData.print_name,
        posName: this.myData.pos_name,
        description: this.myData.description,
        subtitle: this.myData.subtitle,
        storeName: this.myData.store_id,
       
// optionSet:JSON.parse(dish_option_set_json)
      });
      //  this.Ingredients=JSON.parse(this.myData)
      this.selectedSubcategories=JSON.parse(this.myData.dish_option_set_json)
      this.Ingredients=JSON.parse(this.myData.dish_ingredients_json)
      this.choices=JSON.parse(this.myData.dish_choices_json)
      // dish_choices_json
    }
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
    if (this.type == 'Edit') {
      this.reqbody = {
        "type": "update",
        "dish_id": this.myData?.dish_id,
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
         dish_image:this.myData.dish_image,
        // "created_by": 1,
        "dish_option_set_json": JSON.stringify(this.selectedSubcategories),
        "dish_ingredients_json": JSON.stringify(this.Ingredients),
        "dish_choices_json": JSON.stringify(this.choices),
      }
    } else {
      this.reqbody = {
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
        "dish_option_set_json": JSON.stringify(this.selectedSubcategories),
        "dish_ingredients_json": JSON.stringify(this.Ingredients as any),
        "dish_choices_json": JSON.stringify(this.choices),
      }
    }
    if (this.menuForm.invalid) {
      Object.keys(this.menuForm.controls).forEach(key => {
        this.menuForm.get(key)?.markAsTouched();
      });
    } else {
      const formData = new FormData();
      formData.append("image", this.file); // Attach Blob with a filename
      formData.append("body", JSON.stringify(this.reqbody));
      console.log(this.reqbody)
      this.apiService.postApi(AppConstants.api_end_points.dish, formData).subscribe((res: any) => {
        if (res.code === "1") {
          Swal.fire("Success!", res.message, "success").then((result) => {
            if (result) {
              console.log("User clicked OK");
              // this.router.navigate(["/menus/dish"]);
              this.modal.dismissAll();

            }
          });
          // this.modal.dismissAll("refresh");
        } else {
          alert(res.message || "Failed to add Dish");
        }
      });
    }
  }




  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      console.log(input.files[0])
      this.file = input.files[0];
  this.menuForm.get('image')?.setValue(this.file);
  
    }
  }
 
}