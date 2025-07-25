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

export interface ParsedOptionSet {
  option_set_id: number;
  option_set_name: string;
  dispaly_name: string;
  hide_opion_set_json: string;
  option_set_combo_json: string;
  hide_name: number;
  required: number;
  select_multiple: number;
  enable_option_quantity: number;
  min_options_required: number;
  max_options_allowed: number;
  free_qunatity: number;
  option_set_dishes: string;
  inc_price_in_free_quantity_promos: number;
  status: string;
  created_by: number;
  created_on: string;
  updated_on: string | null;
  updtaed_by: number | null;
}

export interface OptionCombo {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
}

export interface ParsedIngredient {
  name: string;
}

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
  displayName?: string;
}

export interface SelectedDishItem {
  name: string;
  display_name: string;
  dish_price: number;
  basePrice: number;
  currentCalculatedPrice: number;
  notes: string;
  originalDishId?: number;
  quantity: number;

  base: {
    selectedBase: BaseOption | null;
    options: BaseOption[];
    required?: boolean;
    displayName?: string;
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
  dish_option_set_array?: ParsedOptionSet[];
  display_name?: string;
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
  imports: [CardComponent, CommonModule, FormsModule, NgIf],
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

  @Output() itemAdded = new EventEmitter<CartItem>();
  @Output() itemDecreased = new EventEmitter<CartItem>();

  itemsList: DishFromAPI[] = [];
  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;
  @ViewChild("modalContent") modalContent!: ElementRef;

  selectedCategory: any;
  categoriesList: any[] = [];
  dishList: DishFromAPI[] = [];

  selectedItem: SelectedDishItem | null = null;

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
        this.loadItemsBySelectedTitle();
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

  loadItemsBySelectedTitle() {
    const navigationState = history.state;
    const savedTitle = this.sessionStorageService.getSelectedMenuTitle();

    let targetCategory = null;

    if (navigationState && navigationState.title) {
      this.selectedTitle1 = navigationState.title;
      targetCategory = this.categoriesList.find(
        (cat) => cat.name && cat.name.trim() === navigationState.title.trim()
      );
      this.sessionStorageService.setSelectedMenuTitle(navigationState.title);
      history.replaceState({}, "");
    } else if (savedTitle) {
      this.selectedTitle1 = savedTitle;
      targetCategory = this.categoriesList.find(
        (cat) => cat.name && cat.name.trim() === savedTitle.trim()
      );
    } else if (this.categoriesList && this.categoriesList.length > 0) {
      this.selectedTitle1 = this.categoriesList[0].name;
      targetCategory = this.categoriesList[0];
      this.sessionStorageService.setSelectedMenuTitle(this.selectedTitle1);
    }

    if (targetCategory) {
      this.selectedCategory = targetCategory;
      this.dishList = targetCategory.dishes;
    } else {
      this.dishList = [];
    }

    this.sessionStorageService.selectedMenuTitle$
      .pipe(filter((title) => !!title && title.trim() !== this.selectedTitle1))
      .subscribe((title) => {
        this.selectedTitle1 = title;
        const changedCategory = this.categoriesList.find(
          (cat) => cat.name && cat.name.trim() === title.trim()
        );
        if (changedCategory) {
          this.selectedCategory = changedCategory;
          this.dishList = changedCategory.dishes;
        } else {
          this.dishList = [];
        }
        this.cdr.detectChanges();
      });

    console.log(
      "Selected Title (after loadItemsBySelectedTitle):",
      this.selectedTitle1
    );
    this.cdr.detectChanges();
  }

  addItem(item: DishFromAPI) {
    if (item.status === 1 || item.status === "Available") {
      item.quantity = (item.quantity || 0) + 1;
      this.cdr.detectChanges();
    }
  }

  decreaseItem(item: DishFromAPI) {
    if (item.quantity && item.quantity > 0) {
      item.quantity--;
      this.cdr.detectChanges();
    }
  }

  increaseItem(item: DishFromAPI) {
    if (item.status === 1 || item.status === "Available") {
      item.quantity = (item.quantity || 0) + 1;
      this.cdr.detectChanges();
    }
  }

  openIngredientsPopup(item: DishFromAPI) {
    console.log("--- Opening Ingredients Popup ---");
    console.log("Item received:", item);
    console.log("Raw dish_ingredients_json:", item.dish_ingredients_json);
    console.log("Raw dish_option_set_json:", item.dish_option_set_json);

    this.selectedItem = {
      name: item.dish_name || item.display_name || "N/A Dish",
      display_name: item.display_name || item.dish_name || "N/A Dish",
      dish_price: parseFloat(item.dish_price || "0"),
      basePrice: parseFloat(item.dish_price || "0"),
      currentCalculatedPrice: parseFloat(item.dish_price || "0"),
      quantity: 1,
      notes: "",
      originalDishId: item.dish_id,
      base: {
        selectedBase: null,
        options: [],
        required: false,
        displayName: "Base Options",
      },
      extraToppings: {
        maxSelect: 0,
        selectedCount: 0,
        options: [],
        displayName: "Extra Toppings",
      },
      extraSwirlsSauces: {
        maxSelect: 0,
        selectedCount: 0,
        options: [],
        displayName: "Extra Swirls / Sauces",
      },
      ingredients: {
        options: [],
        displayName: "Ingredients (Uncheck to remove)",
      },
    };

    if (item.dish_ingredients_json) {
      try {
        const rawIngredients: ParsedIngredient[] = JSON.parse(
          item.dish_ingredients_json
        );
        this.selectedItem.ingredients.options = rawIngredients
          .filter((ing) => ing.name && ing.name.trim() !== "")
          .map((ing) => ({ name: ing.name, selected: true }));
      } catch (e) {
        console.error("Error parsing dish_ingredients_json:", e);
        this.selectedItem.ingredients.options = [];
      }
    }

    let optionSets: ParsedOptionSet[] = [];
    if (
      item.dish_option_set_array &&
      Array.isArray(item.dish_option_set_array)
    ) {
      optionSets = item.dish_option_set_array;
    } else if (item.dish_option_set_json) {
      try {
        optionSets = JSON.parse(item.dish_option_set_json);
      } catch (e) {
        console.error("Error parsing dish_option_set_json:", e);
        optionSets = [];
      }
    }

    optionSets.forEach((optionSet: ParsedOptionSet) => {
      const parsedOptions: Option[] = [];
      try {
        const comboOptions: OptionCombo[] = JSON.parse(
          optionSet.option_set_combo_json
        );
        comboOptions.forEach((opt: OptionCombo) => {
          parsedOptions.push({
            name: opt.name,
            price: parseFloat(opt.price as any) || 0,
            selected: false,
          });
        });
      } catch (e) {
        console.error(
          `Error parsing option_set_combo_json for option set "${optionSet.dispaly_name}":`,
          e
        );
      }

      switch (optionSet.dispaly_name) {
        case "Base":
          this.selectedItem!.base.options = parsedOptions.map((opt) => ({
            ...opt,
            price: opt.price || 0,
          }));
          this.selectedItem!.base.required = optionSet.required === 1;
          this.selectedItem!.base.displayName = optionSet.dispaly_name;

          if (this.selectedItem!.base.options.length > 0) {
            let defaultBase = this.selectedItem!.base.options[0];
            if (this.selectedItem!.base.required) {
              const freeOptions = this.selectedItem!.base.options.filter(
                (opt: BaseOption) => opt.price === 0
              );
              if (freeOptions.length > 0) {
                defaultBase = freeOptions[0];
              }
            }
            this.selectBase(defaultBase);
          }
          break;
        case "Extra Toppings":
          this.selectedItem!.extraToppings.options = parsedOptions;
          this.selectedItem!.extraToppings.maxSelect =
            optionSet.max_options_allowed;
          this.selectedItem!.extraToppings.selectedCount = 0;
          this.selectedItem!.extraToppings.displayName = optionSet.dispaly_name;
          break;
        case "Extra Swirls / Sauces":
        case "Sauces":
          this.selectedItem!.extraSwirlsSauces.options = parsedOptions;
          this.selectedItem!.extraSwirlsSauces.maxSelect =
            optionSet.max_options_allowed;
          this.selectedItem!.extraSwirlsSauces.selectedCount = 0;
          this.selectedItem!.extraSwirlsSauces.displayName =
            optionSet.dispaly_name;
          break;
      }
    });

    this.recalculatePrice();

    console.log("Selected Item after processing:", this.selectedItem);
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  closePopup() {
    this.showPopup = false;
    this.quantity = 1;
    this.selectedItem = null;
    this.cdr.detectChanges();
  }

  increaseQty() {
    this.quantity++;
    if (this.selectedItem) {
      this.recalculatePrice();
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
      if (this.selectedItem) {
        this.recalculatePrice();
      }
    }
  }

  selectBase(selectedBaseOption: BaseOption) {
    if (!this.selectedItem) return;
    if (this.selectedItem.base.selectedBase === selectedBaseOption) {
      return;
    }

    this.selectedItem.base.options.forEach((option: BaseOption) => {
      option.selected = false;
    });

    selectedBaseOption.selected = true;
    this.selectedItem.base.selectedBase = selectedBaseOption;

    this.recalculatePrice();
  }

  toggleTopping(topping: Option) {
    if (!this.selectedItem) return;
    topping.selected = !topping.selected;

    this.selectedItem.extraToppings.selectedCount =
      this.selectedItem.extraToppings.options.filter(
        (t: Option) => t.selected
      ).length;

    const max = this.selectedItem.extraToppings.maxSelect || 0;

    if (
      topping.selected &&
      max > 0 &&
      this.selectedItem.extraToppings.selectedCount! > max
    ) {
      topping.selected = false;
      this.selectedItem.extraToppings.selectedCount!--;
      console.warn(`Cannot select more than ${max} extra toppings.`);
    }
    this.recalculatePrice();
  }

  toggleSauce(sauce: Option) {
    if (!this.selectedItem) return;
    sauce.selected = !sauce.selected;

    this.selectedItem.extraSwirlsSauces.selectedCount =
      this.selectedItem.extraSwirlsSauces.options.filter(
        (s: Option) => s.selected
      ).length;

    const max = this.selectedItem.extraSwirlsSauces.maxSelect || 0;

    if (
      sauce.selected &&
      max > 0 &&
      this.selectedItem.extraSwirlsSauces.selectedCount! > max
    ) {
      sauce.selected = false;
      this.selectedItem.extraSwirlsSauces.selectedCount!--;
      console.warn(`Cannot select more than ${max} extra swirls/sauces.`);
    }
    this.recalculatePrice();
  }

  recalculatePrice() {
    if (!this.selectedItem) return;

    let totalPrice = this.selectedItem.dish_price;

    if (
      this.selectedItem.base.selectedBase &&
      this.selectedItem.base.selectedBase.price > 0
    ) {
      totalPrice += this.selectedItem.base.selectedBase.price;
    }

    this.selectedItem.extraToppings.options.forEach((topping: Option) => {
      if (topping.selected && typeof topping.price === "number") {
        totalPrice += topping.price;
      }
    });

    this.selectedItem.extraSwirlsSauces.options.forEach((sauce: Option) => {
      if (sauce.selected && typeof sauce.price === "number") {
        totalPrice += sauce.price;
      }
    });

    this.selectedItem.currentCalculatedPrice = totalPrice * this.quantity;
    this.cdr.detectChanges();
  }

  addDish() {
    if (!this.selectedItem) return;

    const selectedToppings = this.selectedItem.extraToppings.options.filter(
      (t: Option) => t.selected
    );
    const selectedSwirlsSauces =
      this.selectedItem.extraSwirlsSauces.options.filter(
        (s: Option) => s.selected
      );
    const removedIngredients = this.selectedItem.ingredients.options.filter(
      (i: Option) => !i.selected
    );

    let ingredientsSummary = "";
    if (this.selectedItem.base.selectedBase) {
      ingredientsSummary += `Base: ${this.selectedItem.base.selectedBase.name}`;
    }

    if (selectedToppings.length > 0) {
      ingredientsSummary +=
        (ingredientsSummary ? ", " : "") +
        `Toppings: ${selectedToppings.map((t: Option) => t.name).join(", ")}`;
    }
    if (selectedSwirlsSauces.length > 0) {
      ingredientsSummary +=
        (ingredientsSummary ? ", " : "") +
        `Sauces: ${selectedSwirlsSauces.map((s: Option) => s.name).join(", ")}`;
    }
    if (removedIngredients.length > 0) {
      ingredientsSummary +=
        (ingredientsSummary ? ", " : "") +
        `Removed: ${removedIngredients.map((i: Option) => i.name).join(", ")}`;
    }
    if (ingredientsSummary === "") {
      ingredientsSummary = "No modifications";
    }

    const cartItem: CartItem = {
      name: this.selectedItem.name,
      price: this.selectedItem.currentCalculatedPrice,
      quantity: this.quantity,
      Ingredients: ingredientsSummary,
      title: this.selectedCategory
        ? this.selectedCategory.name
        : "Custom Order",
      status: "Available",
      dishId: this.selectedItem.originalDishId,
      notes: this.selectedItem.notes,
      selectedBaseOption: this.selectedItem.base.selectedBase
        ? {
            name: this.selectedItem.base.selectedBase.name,
            price: this.selectedItem.base.selectedBase.price,
          }
        : undefined,
      selectedToppings: selectedToppings.map((t: Option) => ({
        name: t.name,
        price: t.price,
      })),
      selectedSwirlsSauces: selectedSwirlsSauces.map((s: Option) => ({
        name: s.name,
        price: s.price,
      })),
      removedIngredients: removedIngredients.map((i: Option) => ({
        name: i.name,
      })),
    };

    this.itemAdded.emit(cartItem);
    this.closePopup();
    console.log("Dish added to cart:", cartItem);
  }

  addMedia() {}
  dishSelector(i: number) {}
}
