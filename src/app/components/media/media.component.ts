import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CardComponent } from "../../shared/components/card/card.component";
import { MediaLibrary, media } from "../../shared/data/media";
import { ClickOutsideDirective } from "../../shared/directive/click-outside.directive";
import { AddMediaComponent } from "./add-media/add-media.component";
import { OrderDetailsComponent } from "../orders/order-details/order-details.component";
import { CommonService } from "../../shared/services/common.service";
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { FeatherIconsComponent } from "../../shared/components/feather-icons/feather-icons.component";
import { CommonModule, NgIf, DecimalPipe } from "@angular/common"; // Removed NgFor as it's not explicitly used with @for syntax
import { FormsModule } from "@angular/forms";
import { DishSelectorComponent } from "./dish-selector/dish-selector.component";
import { ApisService } from "../../shared/services/apis.service";
import { AppConstants } from "../../app.constants";
import { forkJoin } from "rxjs";

// Define interfaces for better type safety and clarity
interface Option {
  name: string;
  price?: number; // Make price optional for options that might not have it (like ingredients)
  selected: boolean;
}

interface BaseOption {
  name: string;
  price: number; // Price is required for base options
  selected: boolean;
}

interface ItemOptions {
  maxSelect?: number; // Optional for max selections (e.g., toppings)
  selectedCount?: number; // Optional to track current selections
  options: Option[]; // Use only Option, now that price is optional
}

interface SelectedDishItem {
  name: string;
  basePrice: number;
  currentCalculatedPrice: number;
  notes: string;
  base: {
    selectedBase: BaseOption | null;
    options: BaseOption[];
  };
  extraToppings: ItemOptions;
  extraSwirlsSauces: ItemOptions;
  ingredients: ItemOptions; // Changed to ItemOptions (which uses Option[])
}

@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrl: "./media.component.scss",
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1050;
    }

    /* Custom styles for the toggle switches if needed to match screenshot */
    .form-switch .form-check-input {
      width: 3em; /* Adjust width as needed */
      height: 1.5em; /* Adjust height as needed */
      margin-left: -2em; /* Adjust margin to align properly */
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%236c757d'/%3e%3c/svg%3e");
      transition: background-position .15s ease-in-out;
    }

    .form-switch .form-check-input:checked {
      background-position: right center;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
      background-color: #ffc107; /* Warning color for checked state */
      border-color: #ffc107;
    }
  `],
  // Removed NgFor as it's not explicitly used with @for syntax. NgIf and DecimalPipe are fine.
  imports: [CardComponent, CommonModule, FormsModule, NgIf, DecimalPipe],
})
export class MediaComponent {
  public searchText: string = "";
  public isSearch: boolean = false;
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  showPopup: boolean = false;
  public MediaLibrary = MediaLibrary;
  public url: string[] = [];
  selectedTitle1: any = "";
  quantity = 1;
  expandedIndex: number | null = null;
  @Output() itemAdded = new EventEmitter<CartItem>();
  @Output() itemDecreased = new EventEmitter<CartItem>();

  itemsList: CartItem[] = [];
  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;
  selectedCategory: any;
  categoriesList: any;
  dishList: any[] = [];

  // Initialize selectedItem with a default structure
  // This initialization ensures all nested properties are defined, preventing 'possibly undefined' errors
  selectedItem: SelectedDishItem = {
    name: "",
    basePrice: 0,
    currentCalculatedPrice: 0,
    notes: "",
    base: {
      selectedBase: null,
      options: [],
    },
    extraToppings: {
      maxSelect: 0,
      selectedCount: 0, // Ensure selectedCount is initialized
      options: [],
    },
    extraSwirlsSauces: {
      maxSelect: 0,
      selectedCount: 0, // Ensure selectedCount is initialized
      options: [],
    },
    ingredients: {
      options: [],
    },
  };

  constructor(
    public modal: NgbModal,
    private apiService: ApisService,
    private commonService: SessionStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getDishslist();
 
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -150,
      behavior: "smooth",
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 150,
      behavior: "smooth",
    });
  }

getDishslist(){
    const userId = JSON.parse(this.commonService.getsessionStorage('loginDetails') as any).user.user_id;
      const categoryApi = this.apiService.getApi(`/api/category?user_id=` + userId);
      const dishApi = this.apiService.getApi(AppConstants.api_end_points.dish + '?user_id=' + userId);
  
      forkJoin([categoryApi, dishApi]).subscribe(
        ([categoryRes, dishRes]: any) => {
          const resi = this.apiService.posMenuTree(categoryRes.categories, dishRes.data)
      this.categoriesList=resi
      this.dishList=resi[0].dishes
      this.selectedCategory =resi[0]
})
}
selectCategory(category: any) {
  console.log(category)
    this.dishList=category.dishes
    this.selectedCategory =category
}
 



  searchTerm(term: string) {
    // Implement search logic here if needed
  }

  loadItemsBySelectedTitle() {
    // Your existing logic here.
    // Ensure that `items` is populated or replaced by `dishList` if `items` is no longer needed.
    const navigationState = history.state;
    const savedTitle = this.commonService.getSelectedMenuTitle();

    if (navigationState && navigationState.title) {
      this.selectedTitle1 = navigationState.title;
      // Note: `this.items` was a hardcoded list in your original code.
      // Filter `this.dishList` here instead, as that's your API data source.
      this.itemsList = this.dishList.filter(
        (item) => item.category_name && item.category_name.trim() === navigationState.title.trim()
      );
      this.commonService.setSelectedMenuTitle(navigationState.title);
      history.replaceState({}, "");
    } else if (savedTitle) {
      this.selectedTitle1 = savedTitle;
      this.itemsList = this.dishList.filter(
        (item) => item.category_name && item.category_name.trim() === savedTitle.trim()
      );
    } else {
      this.selectedTitle1 = "Classic Range Pizzas"; // or any default
      this.itemsList = this.dishList.filter(
        (item) => item.category_name && item.category_name.trim() === this.selectedTitle1
      );
      this.commonService.setSelectedMenuTitle(this.selectedTitle1);
    }

    this.commonService.selectedMenuTitle$.subscribe((title) => {
      if (title && title.trim()) {
        this.selectedTitle1 = title;
        this.itemsList = this.dishList.filter(
          (item) => item.category_name && item.category_name.trim() === title.trim()
        );
      }
    });
    console.log("Selected Title:", this.selectedTitle1);
  }

  open(data: media) {
    this.MediaLibrary.forEach((item) => {
      if (data.id === item.id) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
    });
  }

  addMedia() {
    this.modal.open(AddMediaComponent, {
      windowClass: "media-modal theme-modal",
      size: "xl",
    });
  }

  addItem(item: CartItem) {
    item.quantity = 1;
    this.itemAdded.emit(item);
  }

  decreaseItem(item: CartItem) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
      this.itemDecreased.emit(item);
    } else {
      item.quantity = 0;
      this.itemDecreased.emit(item);
    }
  }

  increaseItem(item: CartItem) {
    item.quantity++;
    this.itemAdded.emit(item);
  }

  openIngredientsPopup(item: any) {
    if (item.status === "Available") { // Check for string "Available" after mapping
      this.selectedItem = {
        name: item.dish_name,
        basePrice: item.dish_price,
        currentCalculatedPrice: item.dish_price, // Will be recalculated immediately
        notes: item.notes || "",
        base: {
          selectedBase: { name: "Small", price: 0, selected: true }, // Default selection
          options: [
            { name: "Small", price: 0, selected: true },
            { name: "Large", price: 3.00, selected: false },
            { name: "Thin Base Large", price: 4.00, selected: false },
            { name: "Gluten Free Base Large", price: 6.00, selected: false },
          ],
        },
        extraToppings: {
          maxSelect: 5,
          selectedCount: 0, // Ensure this is explicitly set
          options: [
            { name: "Mozzarella", price: 3.00, selected: false },
            { name: "Paneer", price: 3.00, selected: false },
            { name: "Chicken", price: 3.00, selected: false },
            { name: "Ham", price: 3.00, selected: false },
            { name: "Bacon", price: 3.00, selected: false },
            { name: "Pepperoni", price: 3.00, selected: false },
            { name: "Prawns", price: 3.00, selected: false },
            { name: "Salmon", price: 3.00, selected: false },
            { name: "Anchovies", price: 3.00, selected: false },
            { name: "Pineapple", price: 3.00, selected: false },
            { name: "Mushrooms", price: 2.00, selected: false },
            { name: "Sweet corn", price: 1.00, selected: false },
            { name: "Black Olives", price: 1.00, selected: false },
            { name: "Coriander", price: 1.00, selected: false },
            { name: "Capsicum", price: 1.00, selected: false },
            { name: "Onions", price: 1.00, selected: false },
            { name: "Jalapeños", price: 1.00, selected: false },
          ],
        },
        extraSwirlsSauces: {
          maxSelect: 3,
          selectedCount: 0, // Ensure this is explicitly set
          options: [
            { name: "Butter Sauce", price: 0.90, selected: false },
            { name: "Peri Peri Sauce", price: 0.90, selected: false },
            { name: "Hot Chili Sauce", price: 0.90, selected: false },
            { name: "Chipotle Sauce", price: 0.90, selected: false },
            { name: "Garlic Aioli", price: 0.90, selected: false },
            { name: "Mayonnaise", price: 0.90, selected: false },
            { name: "BBQ Sauce", price: 0.90, selected: false },
            { name: "Hollandaise Sauce", price: 0.90, selected: false },
            { name: "Sweet Chili Sauce", price: 0.90, selected: false },
            { name: "Tomato Sauce", price: 0.90, selected: false },
          ],
        },
        ingredients: {
          options: [
            { name: "Tomato Base", selected: true }, // No price needed for ingredients, as per new Option interface
            { name: "Ham Slices", selected: true },
            { name: "Pineapple", selected: true },
            { name: "Mozzarella", selected: true },
            { name: "Bacon", selected: true },
          ],
        },
      };
      this.quantity = 1; // Reset quantity when opening new modal
      this.recalculatePrice(); // Calculate initial price
      this.expandedIndex = null; // No sections expanded by default
      this.showPopup = true;
      this.cdr.detectChanges();
    } else {
      this.showPopup = false;
      console.warn(`Cannot open modal for "${item.dish_name}" as it is "${item.status}".`);
    }
  }

  closePopup() {
    this.showPopup = false;
    this.expandedIndex = null; // Reset expanded state on close
  }

  // Method to handle base option selection (radio-like behavior)
  selectBase(selectedBaseOption: BaseOption) {
    this.selectedItem.base.options.forEach(option => {
      option.selected = (option.name === selectedBaseOption.name);
    });
    this.selectedItem.base.selectedBase = selectedBaseOption; // Set the actual selected object
    this.recalculatePrice();
  }

  // Method to handle topping selection (checkbox-like behavior with max limit)
  toggleTopping(topping: Option) {
    if (topping.selected) {
      this.selectedItem.extraToppings.selectedCount = (this.selectedItem.extraToppings.selectedCount || 0) + 1;
    } else {
      this.selectedItem.extraToppings.selectedCount = (this.selectedItem.extraToppings.selectedCount || 0) - 1;
    }
    this.recalculatePrice();
  }

  // Method to handle sauce selection (checkbox-like behavior with max limit)
  toggleSauce(sauce: Option) {
    if (sauce.selected) {
      this.selectedItem.extraSwirlsSauces.selectedCount = (this.selectedItem.extraSwirlsSauces.selectedCount || 0) + 1;
    } else {
      this.selectedItem.extraSwirlsSauces.selectedCount = (this.selectedItem.extraSwirlsSauces.selectedCount || 0) - 1;
    }
    this.recalculatePrice();
  }

  // Recalculates the total price based on selections and quantity
  recalculatePrice() {
    let totalPrice = this.selectedItem.basePrice;

    // Add selected base price
    if (this.selectedItem.base.selectedBase) {
      totalPrice += this.selectedItem.base.selectedBase.price;
    }

    // Add selected toppings prices
    this.selectedItem.extraToppings.options.forEach((topping: Option) => {
      if (topping.selected && topping.price !== undefined) { // Check for undefined price
        totalPrice += topping.price;
      }
    });

    // Add selected swirls/sauces prices
    this.selectedItem.extraSwirlsSauces.options.forEach((sauce: Option) => {
      if (sauce.selected && sauce.price !== undefined) { // Check for undefined price
        totalPrice += sauce.price;
      }
    });

    // Apply quantity to the total price
    this.selectedItem.currentCalculatedPrice = totalPrice * this.quantity;
  }

  // Override existing quantity methods to also call recalculatePrice
  increaseQty() {
    this.quantity++;
    this.recalculatePrice();
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
      this.recalculatePrice();
    }
  }

  addDish() {
    // This is where you would collect all selected options and the final price
    // and add the item to the cart/order.
    console.log("Dish to add:", JSON.parse(JSON.stringify(this.selectedItem))); // Deep copy for log
    console.log("Quantity:", this.quantity);

    // Example of constructing a simpler cart item from selectedItem
    const cartItem: CartItem = {
      name: this.selectedItem.name,
      price: this.selectedItem.currentCalculatedPrice,
      quantity: this.quantity,
      Ingredients: "Customized " + this.selectedItem.name, // Or build a detailed string
      title: "Custom Order",
      status: "Available", // Assuming a custom item is available
      // Add other relevant properties from selectedItem if needed for your cart
      // e.g., selected toppings, base, notes etc.
    };

    this.itemAdded.emit(cartItem); // Emit the customized item
    this.closePopup(); // Close the modal after adding
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  // This method and `selectedDishes` array are typically used with NgbModal,
  // not directly with the custom `showPopup` modal.
  // Keeping it for now as it was in your original code, but it's not directly
  // used by the new modal structure we implemented.
  dishSelector(i: number) {
    const modalRef = this.modal.open(DishSelectorComponent, {
      windowClass: "theme-modal",
      centered: true,
    });

    modalRef.result.then(
      (dish: string) => {
        // This line is only relevant if you want to store the selected dish from DishSelectorComponent
        // this.selectedDishes[i] = dish;
      },
      (reason) => {
        // Handle modal dismiss/cancel
      }
    );
  }
}

// Updated CartItem interface to reflect potential new data coming from dishList
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img?: string;
  Ingredients: string;
  title: string;
  status: string | number; // Updated to accept number for status
  dish_name?: string;
  dish_price?: number;
  dish_image?: string;
  category_name?: string;
  // Potentially add more properties if you want to store the selected options in your cart item
  // selectedBaseOption?: BaseOption;
  // selectedToppings?: Option[];
  // selectedSauces?: Option[];
  // notes?: string;
}