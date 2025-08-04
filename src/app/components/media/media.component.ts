import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  HostListener,
  OnInit,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CardComponent } from "../../shared/components/card/card.component";
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { CommonModule, NgIf, DecimalPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApisService } from "../../shared/services/apis.service";
import { AppConstants } from "../../app.constants";
import { forkJoin } from "rxjs";
import { filter } from "rxjs/operators";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

import { IgxNavbarComponent, IgxNavbarTitleDirective, IgxButtonDirective, IgxToggleActionDirective, IgxIconComponent, IgxDropDownComponent, IgxDropDownItemComponent, IgxSuffixDirective, IgxNavbarModule, IgxButtonModule, IgxDropDownModule, IgxIconModule, IgxToggleModule, IgxToggleDirective, ISelectionEventArgs, ConnectedPositioningStrategy, OverlaySettings, HorizontalAlignment, VerticalAlignment } from "igniteui-angular";


export interface Option {
  name: string;
  price?: number;
  selected: boolean;
  uniqueId?: string;
}

export interface BaseOption {
  name: string;
  price: number;
  selected: boolean;
  uniqueId?: string;
}

export interface ItemOptions {
  maxSelect?: number;
  selectedCount?: number;
  options: Option[];
  required?: boolean;
}

export interface SelectedDishItemForModal {
  name: string;
  basePrice: number;
  currentCalculatedPrice: number;
  notes: string;
  originalDishId?: number;
  quantity: number;

  baseOptions: ItemOptions;
  extraToppingsOptions: ItemOptions;
  extraSwirlsSaucesOptions: ItemOptions;
  ingredientsOptions: ItemOptions;

  parsedOptionSets?: any[];
  parsedIngredients?: any[];
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

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  Ingredients: string;
  title: string;
  status: string | number;
  dishId?: number;
  selectedBaseOption?: { name: string; price: number };
  selectedToppings?: { name: string; price?: number }[];
  selectedSwirlsSauces?: { name: string; price?: number }[];
  removedIngredients?: { name: string }[];
  notes?: string;
  modalSelectedBaseChoice?: string;
}

@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],

  imports: [
    CommonModule,
    IgxNavbarModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxDropDownModule,
    CardComponent,
    FormsModule,
    NgbDropdownModule,
  ],
  standalone: true,
})
export class MediaComponent implements OnInit {
  @Output() itemAdded = new EventEmitter<CartItem>();
  @Output() itemDecreased = new EventEmitter<CartItem>();
  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;
  // Removed duplicate declaration of modalContent
  selectedCategory: any;
  categoriesList: any[] = [];
  dishList: DishFromAPI[] = [];
  selectedItemForModal: SelectedDishItemForModal | null = null;
  selectedDishFromList: any;
  selectedExpandedChoice: string = "";
  modalNotes: string = "";
  modalQuantity: number = 1;
  expandedIndex: number | null = null;
  showMenuPopup: boolean = false;
  expandedParentIndex: number | null = null;
  selectedChildIndex: number | null = null;
  selectedChildLabel: string | null = null;
  public searchText: string = "";
  showPopup: boolean = false;
    accordionOpen = false;
  overlaySettings!: OverlaySettings;
  cartItems: DishFromAPI[];
  totalPrice: any;
    activeSubmenu: any;
    openComboIndex: number | null = null;
    hoveredComboIndex: number | null = null;
      mainItems = [
    { label: 'Web', children: ['Angular', 'React'] },
    { label: 'Desktop', children: ['WPF', 'WinForms'] },
    {
      label: 'Cross Platform',
      children: ['Ultimate UI for Uno', 'Ultimate UI for UWP', 'Ultimate UI for WinUI', 'Ultimate UI for Xamarin']
    },
    { label: 'Design to Code' },
    { label: 'Testing Tools' }
  ];

  optionGroups: any = [
    {
      title: 'Base',
      required: true,
      type: 'radio',
      options: [
        { name: 'Gluten Free ( Gluten Free Base )', price: 18 },
        { name: 'Traditional ( Thin Base )' },
        { name: 'Pan ( Thick Base )' }
      ],
      selected: null
    },
    {
      title: 'Extra Meat Toppings',
      type: 'counter',
      options: [
        { name: 'Bacon', price: 22.9, count: 0 },
        { name: 'Chicken', price: 22.9, count: 0 },
        // ...
      ]
    },
    {
      title: 'Swap Base Sauce',
      subtitle: 'Optional - Choose one item',
      type: 'checkbox',
      options: [
        { name: 'BBQ Base', selected: false },
        { name: 'Chutney Base', selected: false },
        { name: 'Chilli Base', selected: false },
        { name: 'Mayo Base', price: 6, selected: false },
        // ...
      ]
    }
  ];
  comboDishDetails: any=[];
  totalDishList: any[];
  constructor(
    public modal: NgbModal,
    private apiService: ApisService,
    private sessionStorageService: SessionStorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getDishslist();
  }

  getDishslist() {
    const userId = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user.user_id;

    const categoryApi = this.apiService.getApi(
      `/api/category?user_id=` + userId
    );
    const dishApi = this.apiService.getApi(
      AppConstants.api_end_points.dish + "?user_id=" + userId
    );

    forkJoin([categoryApi, dishApi]).subscribe(
      ([categoryRes, dishRes]: any) => {
        console.log("Category API Response:", categoryRes);
        console.log("Dish API Response:", dishRes);

        const processedMenu = this.apiService.posMenuTree(
          categoryRes.categories,
          dishRes.data
        );
console.log("Processed Menu:", processedMenu);
        this.categoriesList = processedMenu;
        this.totalDishList = dishRes.data;
        if (this.categoriesList && this.categoriesList.length > 0) {
          this.selectedCategory = this.categoriesList[0];
          this.dishList = this.selectedCategory.dishes;
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching dish list or categories:", error);
      }
    );
  }

  scrollLeft() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -150,
        behavior: "smooth",
      });
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 150,
        behavior: "smooth",
      });
    }
  }
  selectCategory(category: any) {
    this.dishList = category.dishes;
    this.selectedCategory = category;
    this.cdr.detectChanges();
  }

  searchTerm(term: string) {
    this.cdr.detectChanges();
  }

 decreaseItem(item: DishFromAPI): void {
    if (item.quantity && item.quantity > 0) {
      item.quantity--;
      this.cdr.detectChanges();
      const simplifiedCartItem: CartItem = {
        name: item.dish_name,
        price: parseFloat(item.dish_price),
        quantity: item.quantity,
        Ingredients: "",
        title: this.selectedCategory ? this.selectedCategory.name : "Unknown",
        status: item.status,
        dishId: item.dish_id,
        notes: item.notes || "",
      };
      this.itemDecreased.emit(simplifiedCartItem);
    }
  }

  openIngredientsPopup(item: any) {
   

    if(item.dish_type === 'combo'){
      this.comboDishDetails=[]
 console.log(item.dish_choices_json, "openIngredientsPopup combo");
 item.dish_choices_json_array= this.filterIndeterminateCategories(JSON.parse(item.dish_choices_json));
 this.selectedDishFromList = item;
  item['dish_quantity'] = 1; // Ensure quantity is set
    this.selectedDishFromList = item;
    this.selectedDishFromList.duplicate_dish_price = item.dish_price
    this.cartItems = [item]
    this.showPopup = true;
    console.log(this.selectedDishFromList, 'selectedDishFromList 123 456')
    }else{
    this.cartItems = []
    item['dish_option_set_array'].forEach((optionSet: any) => {
      optionSet.option_type = optionSet.dispaly_name == "Base" ? "radio" : optionSet.dispaly_name == "Extra Meat Toppings" ? "counter" : "counter";
    })
    item['dish_quantity'] = 1; // Ensure quantity is set
    this.selectedDishFromList = item;
    this.selectedDishFromList.duplicate_dish_price = item.dish_price
    this.cartItems = [item]
    this.showPopup = true;
    this.cdr.detectChanges();
  }
  }
   filterIndeterminateCategories(menuData: any[]) {
  return menuData.map(menuGroup => ({
    ...menuGroup,
    menuItems: menuGroup.menuItems.map((menu: any) => ({
      ...menu,
      categories: menu.categories
        .map((cat: any) => {
          const checkedDishes = cat.dishes.filter((dish: any) => dish.checked);
          const isIndeterminate = checkedDishes.length > 0 && checkedDishes.length < cat.dishes.length;
          const isChecked = checkedDishes.length === cat.dishes.length && checkedDishes.length > 0;
          return {
            ...cat,
            dishes: checkedDishes,
            indeterminate: isIndeterminate,
            checked: isChecked
          };
        })
        .filter((cat: any) => cat.indeterminate || cat.checked)
    }))
  }));
}
selectedChildPerCombo: { [comboIndex: number]: any } = {};
  selectChild(parentIndex: number, dish: any,comboIndex: number) {
     this.comboDishDetails=[]
    console.log("Selected child:", parentIndex, dish,this.dishList);
   this.comboDishDetails=this.totalDishList.filter((d: any) => d.dish_id == dish.dishId)
// this.openComboIndex = comboIndex;
  this.comboDishDetails.forEach((comboDish: any, idx: number) => {
  this.selectedChildPerCombo[comboIndex] = this.apiService.convertDishObject(comboDish);
  console.log(this.selectedChildPerCombo, 'selectedChildPerCombo')
});
      console.log(this.comboDishDetails,dish.dishId,this.totalDishList ,'comboDishDetails')
    this.selectedChildIndex = parentIndex;
    this.selectedChildLabel = dish;
        this.cdr.detectChanges();
  }
  closePopup() {
    this.showPopup = false;
    this.selectedDishFromList = null;
    this.selectedItemForModal = null;
    this.modalNotes = "";
    this.modalQuantity = 1;
    this.expandedIndex = null;
    this.cdr.detectChanges();
  }
 


  increaseModalQuantity(item: any) {
    item['dish_quantity']++;
    this.calculateTotal();
  }
  decreaseModalQuantity(item: any) {
    if (item['dish_quantity'] > 1) {
      item['dish_quantity']--;
      this.calculateTotal();
    }
  }

  // Call updateTotals() after any increment/decrement or selection change
  increment(option: any) {
    console.log("Incrementing option:", option);
    this.showPopup = true;
    option.quantity = (option.quantity || 0) + 1;
    if (option.quantity > 0) {
      option.selected = true; // Ensure option is selected when incrementing

    }
    this.calculateTotal();
  }
  decrement(option: any) {

    console.log("Decrementing option:", option);
    if (option.quantity > 0) {
      option.quantity--;

    }
    if (option.quantity == 0) {
      option.selected = false; // Ensure option is selected when incrementing

    }
    this.calculateTotal();
    this.cdr.detectChanges();
  }
  selectRadio(group: any, option: any) {
    console.log("Selected option:", option, group);
    group.option_set_array.forEach((opt: any) => {

      opt.selected = (opt === option);; // Deselect all options in the group

    })
    // option.selected =  !option.selected;

    option.quantity = 1; // Reset quantity when selecting a new option

    this.calculateTotal();
    this.cdr.detectChanges();
  }
  toggleCheckbox(option: any) {
    option.selected = !option.selected;
    this.calculateTotal();
  }
  calculateTotal() {
    console.log(this.cartItems, '<-------------------------this.cartItems 01--------')
    this.totalPrice = this.cartItems
      .reduce((sum: any, item: any) => sum + this.apiService.getItemSubtotal(item), 0);

    this.cartItems.forEach((item: any) => {
      item.subtotal = this.totalPrice
      item.duplicate_dish_price = this.totalPrice
    })
    console.log(this.totalPrice, '<-------------------------this.getItemSubtotal(item)--------')
  }
  // showMenuPopup = false;
 addItemToCart(item: any) {
  console.log(item)
    const cartItem = this.moveSelectedOptionsToMainObject(item);
    console.log(cartItem, 'cartItem')
    this.itemAdded.emit(cartItem);
  }
  
moveSelectedOptionsToMainObject(dish: any): CartItem {
  console.log(dish, 'moveSelectedOptionsToMainObject');
  // Collect all options with selected === true from all option sets
  const selectedOptions: any[] = dish.dish_option_set_array
    .flatMap((optionSet: any) =>
      (optionSet.option_set_array).filter((opt: any) => opt.selected === true)
    );
    console.log(selectedOptions, 'selectedOptions')
  dish.selectedOptions = selectedOptions;
  return dish;
}
}