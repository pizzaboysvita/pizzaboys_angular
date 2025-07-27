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

export interface Option {
  name: string;
  price?: number;
  selected: boolean;
}

export interface BaseOption {
  name: string;
  price: number;
  selected: boolean;
}

export interface ItemOptions {
  maxSelect?: number;
  selectedCount?: number;
  options: Option[];
}

export interface SelectedDishItem {
  name: string;
  basePrice: number;
  currentCalculatedPrice: number;
  notes: string;
  originalDishId?: number;
  base: {
    selectedBase: BaseOption | null;
    options: BaseOption[];
    required?: boolean;
  };
  extraToppings: ItemOptions;
  extraSwirlsSauces: ItemOptions;
  ingredients: ItemOptions;
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
}

@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CommonModule, FormsModule],
  standalone: true,
})
export class MediaComponent implements OnInit {
  public searchText: string = "";
  public isSearch: boolean = false;
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  showPopup: boolean = false;
  public url: string[] = [];
  selectedTitle1: any = "";
  quantity = 1;
  expandedIndex: number | null = null;

  @Output() itemAdded = new EventEmitter<CartItem>();
  @Output() itemDecreased = new EventEmitter<CartItem>();

  itemsList: DishFromAPI[] = [];
  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;
  @ViewChild("modalContent") modalContent!: ElementRef;

  selectedCategory: any;
  categoriesList: any[] = [];
  dishList: DishFromAPI[] = [];

  selectedItem:any
  totalPrice: any;
  cartItems: any=[];

  constructor(
    public modal: NgbModal,
    private apiService: ApisService,
    private sessionStorageService: SessionStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getDishslist();
  }

  @HostListener("document:click", ["$event"])
  clickout(event: Event) {
    if (
      this.showPopup &&
      this.modalContent &&
      !this.modalContent.nativeElement.contains(event.target)
    ) {
      const clickedElement = event.target as HTMLElement;
      const isDishCard = clickedElement.closest(".card.flex-row");
      if (!isDishCard) {
        this.closePopup();
      }
    }
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
        const processedMenu = this.apiService.posMenuTree(
          categoryRes.categories,
          dishRes.data
        );

        this.categoriesList = processedMenu;
        if (this.categoriesList && this.categoriesList.length > 0) {
          this.selectedCategory = this.categoriesList[0];
          this.dishList = this.selectedCategory.dishes;
        }
        // this.loadItemsBySelectedTitle();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching dish list or categories:", error);
      }
    );
  }

  selectCategory(category: any) {
    console.log("Selected category:", category);
    this.dishList = category.dishes;
    this.selectedCategory = category;
    this.cdr.detectChanges();
  }

  searchTerm(term: string) {
    this.cdr.detectChanges();
  }



  addItem(item: DishFromAPI) {
    if (item.status === 1 || item.status === "Available") {
      item.quantity = (item.quantity || 0) + 1;
      this.cdr.detectChanges();
    }
  }

  // decreaseItem(item: DishFromAPI) {
  //   if (item.quantity && item.quantity > 0) {
  //     item.quantity--;
  //     this.cdr.detectChanges();
  //   }
  // }

  // increaseItem(item: DishFromAPI) {
  //   if (item.status === 1 || item.status === "Available") {
  //     item.quantity = (item.quantity || 0) + 1;
  //     this.cdr.detectChanges();
  //   }
  // }




  openIngredientsPopup(item: DishFromAPI) {
    console.log("--- Opening Ingredients Popup ---");
    console.log("Item received:", item);
    console.log("Raw dish_ingredients_json:", item.dish_ingredients_json);
    console.log("Raw dish_option_set_json:", item.dish_option_set_json);
    item.quantity=0
this.cartItems=[item]

console.log(this.cartItems,',--------------------------cartItems-----------------')

    this.selectedItem=item
     this.selectedItem.quantity=1
     this.totalPrice=item.dish_price
    this.selectedItem.duplicate_dish_price=item.dish_price
    console.log(this.selectedItem)
this.showPopup=true
   
  }

  closePopup() {
    this.showPopup = false;
    this.expandedIndex = null;
    this.cdr.detectChanges();
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    this.cdr.detectChanges();
  }



  

  addDish(cartItem:any) {
    // const selectedToppings = this.selectedItem.extraToppings.options.filter(
    //   (t:any) => t.selected
    // );
    // const selectedSwirlsSauces =
    //   this.selectedItem.extraSwirlsSauces.options.filter((s:any) => s.selected);
    // const removedIngredients = this.selectedItem.ingredients.options.filter(
    //   (i:any) => !i.selected
    // );

    // const ingredientsSummary =
    //   `Base: ${this.selectedItem.base.selectedBase?.name || "N/A"}` +
    //   (selectedToppings.length > 0
    //     ? `, Toppings: ${selectedToppings.map((t:any) => t.name).join(", ")}`
    //     : "") +
    //   (selectedSwirlsSauces.length > 0
    //     ? `, Sauces: ${selectedSwirlsSauces.map((s:any) => s.name).join(", ")}`
    //     : "") +
    //   (removedIngredients.length > 0
    //     ? `, Removed: ${removedIngredients.map((i:any) => i.name).join(", ")}`
    //     : "");

    // const cartItem: CartItem = {
    //   name: this.selectedItem.name,
    //   price: this.selectedItem.currentCalculatedPrice,
    //   quantity: this.quantity,
    //   Ingredients: ingredientsSummary,
    //   title: this.selectedCategory
    //     ? this.selectedCategory.name
    //     : "Custom Order",
    //   status: "Available",
    //   dishId: this.selectedItem.originalDishId,
    //   notes: this.selectedItem.notes,
    //   selectedBaseOption: this.selectedItem.base.selectedBase
    //     ? {
    //         name: this.selectedItem.base.selectedBase.name,
    //         price: this.selectedItem.base.selectedBase.price,
    //       }
    //     : undefined,
    //   selectedToppings: selectedToppings.map((t:any) => ({
    //     name: t.name,
    //     price: t.price,
    //   })),
    //   selectedSwirlsSauces: selectedSwirlsSauces.map((s:any) => ({
    //     name: s.name,
    //     price: s.price,
    //   })),
    //   removedIngredients: removedIngredients.map((i:any) => ({ name: i.name })),
    // };
    cartItem.seleted_ingredient=cartItem.dish_option_set_array.flatMap((optSet: any) => optSet.option_set_array)
    console.log("Dish added to cart:", cartItem);
    this.itemAdded.emit(cartItem);
    this.closePopup();

  }

  
  
  


  updateItem(action: 'increase' | 'decrease' | 'option', item: any, option?: any) {

    console.log(action,item,option,'>>>>>>>>>>>>>>>>>>>step 1')
  // For quantity
  if (action === 'increase') {
    item.quantity++;
  }

  if (action === 'decrease') {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  // For option (ingredient) toggle
  if (action === 'option' && option) {
    option.selected = !option.selected;
  }

  // Update total after any change
  this.calculateTotal();
}



calculateTotal() {
  this.totalPrice = this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0);
   this.cartItems.forEach((item:any)=>{
item.subtotal=this.totalPrice
   })
   console.log(  this.totalPrice,'<-------------------------this.getItemSubtotal(item)--------')
}

}