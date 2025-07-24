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
  imports: [CardComponent, CommonModule, FormsModule, NgIf, DecimalPipe],
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
      selectedCount: 0,
      options: [],
    },
    extraSwirlsSauces: {
      maxSelect: 0,
      selectedCount: 0,
      options: [],
    },
    ingredients: {
      options: [],
    },
  };

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

  /**
   * Attempts to parse a JSON string. If parsing fails, it logs the error
   * and returns a default value to prevent the application from crashing.
   * This version does NOT attempt to "fix" malformed JSON internally,
   * as robust fixing is often impossible without knowledge of the intended structure.
   * Instead, it logs the error and returns the provided default value.
   * @param jsonString The JSON string to parse.
   * @param defaultValue The value to return if parsing fails.
   * @param propertyName The name of the property being parsed (for logging).
   * @returns Parsed JSON object or the defaultValue on error.
   */
  private safelyParseJson<T>(
    jsonString: string | undefined,
    defaultValue: T,
    propertyName: string
  ): T {
    if (!jsonString || jsonString.trim() === "") {
      // console.log(`${propertyName} is empty or null, returning default.`);
      return defaultValue;
    }
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error(
        `Failed to parse ${propertyName}. Returning default value. Error:`,
        e,
        "Raw string:",
        jsonString
      );
      return defaultValue; // Return default value on any parsing error
    }
  }

  openIngredientsPopup(item: DishFromAPI) {
    console.log("--- Opening Ingredients Popup ---");
    console.log("Item received:", item);
    console.log("Raw dish_ingredients_json:", item.dish_ingredients_json);
    console.log("Raw dish_option_set_json:", item.dish_option_set_json);

    if (item.status === "Available" || item.status === 1) {
      console.log("Item is available, proceeding to show popup.");

      let parsedOptions: any = {
        base: { options: [], required: false },
        extraToppings: { maxSelect: 0, options: [] },
        extraSwirlsSauces: { maxSelect: 0, options: [] },
      };
      let parsedIngredients: Option[] = [];

      // Safely parse dish_option_set_json
      const optionSets = this.safelyParseJson(
        item.dish_option_set_json,
        [], // Default to an empty array if parsing fails
        "dish_option_set_json"
      );

      console.log("Parsed optionSets:", optionSets);

      if (Array.isArray(optionSets)) {
        const findAndParseOptionSet = (sets: any[], names: string[]) => {
          const foundSet = sets.find((set: any) =>
            names.some(
              (name) =>
                set.dispaly_name?.toLowerCase() === name ||
                (set.option_set_name &&
                  set.option_set_name.toLowerCase().includes(name))
            )
          );
          if (foundSet) {
            // Safely parse nested option_set_combo_json
            const options = this.safelyParseJson(
              foundSet.option_set_combo_json,
              [], // Default to an empty array
              `option_set_combo_json for ${
                foundSet.dispaly_name || foundSet.option_set_name
              }`
            );
            if (Array.isArray(options)) {
              return { set: foundSet, options: options };
            } else {
              console.warn(
                `option_set_combo_json parsing resulted in non-array for ${
                  foundSet.dispaly_name || foundSet.option_set_name
                }, defaulting to empty.`
              );
            }
          }
          return null;
        };

        const baseData = findAndParseOptionSet(optionSets, [
          "base",
          "pizza base",
          "base - online",
          "pizza of week base - online",
        ]);
        if (baseData) {
          console.log("Base Options Raw Data:", baseData.options);
          parsedOptions.base = {
            type: "radio",
            required: baseData.set.required === 1 || false,
            options: baseData.options.map((opt: any) => ({
              name: opt.name,
              price: parseFloat(opt.price) || 0,
              selected: false,
            })),
          };
          if (
            parsedOptions.base.required &&
            parsedOptions.base.options.length > 0
          ) {
            parsedOptions.base.options[0].selected = true;
          }
        }

        const toppingsData = findAndParseOptionSet(optionSets, [
          "extra toppings",
          "toppings",
        ]);
        if (toppingsData) {
          console.log("Toppings Options Raw Data:", toppingsData.options);
          parsedOptions.extraToppings = {
            type: "checkbox",
            maxSelect:
              toppingsData.set.max_options_allowed > 0
                ? toppingsData.set.max_options_allowed
                : 5, // Default if max_options_allowed is not valid
            options: toppingsData.options.map((opt: any) => ({
              name: opt.name,
              price: parseFloat(opt.price) || 0,
              selected: false,
            })),
          };
        }

        const swirlsSaucesData = findAndParseOptionSet(optionSets, [
          "extra swirls / sauces",
          "swirls",
          "sauces",
        ]);
        if (swirlsSaucesData) {
          console.log(
            "Swirls/Sauces Options Raw Data:",
            swirlsSaucesData.options
          );
          parsedOptions.extraSwirlsSauces = {
            type: "checkbox",
            maxSelect:
              swirlsSaucesData.set.max_options_allowed > 0
                ? swirlsSaucesData.set.max_options_allowed
                : 3, // Default if max_options_allowed is not valid
            options: swirlsSaucesData.options.map((opt: any) => ({
              name: opt.name,
              price: parseFloat(opt.price) || 0,
              selected: false,
            })),
          };
        }
      } else {
        console.warn(
          "dish_option_set_json parsed to a non-array (or failed), skipping option set processing."
        );
      }

      // Safely parse dish_ingredients_json
      const ingredientsArray = this.safelyParseJson(
        item.dish_ingredients_json,
        [], // Default to an empty array if parsing fails
        "dish_ingredients_json"
      );

      if (Array.isArray(ingredientsArray)) {
        parsedIngredients = ingredientsArray.map((ing: any) => ({
          name: ing.name,
          selected: ing.selected !== undefined ? ing.selected : true,
          price: 0,
        }));
        console.log("Parsed Ingredients:", parsedIngredients);
      } else {
        console.warn(
          "dish_ingredients_json parsed to a non-array (or failed), defaulting to empty ingredients."
        );
      }

      this.selectedItem = {
        name: item.dish_name,
        basePrice: parseFloat(item.dish_price),
        currentCalculatedPrice: parseFloat(item.dish_price),
        notes: item.notes || "",
        originalDishId: item.dish_id,

        base: {
          selectedBase: null,
          options: parsedOptions.base.options,
          required: parsedOptions.base.required,
        },
        extraToppings: {
          maxSelect: parsedOptions.extraToppings.maxSelect,
          selectedCount: 0,
          options: parsedOptions.extraToppings.options,
        },
        extraSwirlsSauces: {
          maxSelect: parsedOptions.extraSwirlsSauces.maxSelect,
          selectedCount: 0,
          options: parsedOptions.extraSwirlsSauces.options,
        },
        ingredients: {
          options: parsedIngredients,
        },
      };

      // Set initial selected base if available
      if (
        this.selectedItem.base.options.length > 0 &&
        !this.selectedItem.base.selectedBase
      ) {
        const preSelectedBase =
          this.selectedItem.base.options.find((opt) => opt.selected) ||
          this.selectedItem.base.options[0];
        if (preSelectedBase) {
          preSelectedBase.selected = true;
          this.selectedItem.base.selectedBase = preSelectedBase;
        }
      }

      this.quantity = 1;
      this.recalculatePrice();
      this.expandedIndex = null;
      this.showPopup = true;
      this.cdr.detectChanges();
      console.log("Final selectedItem state:", this.selectedItem);
    } else {
      this.showPopup = false;
      console.warn(
        `Cannot open modal for "${item.dish_name}" as it is "${item.status}".`
      );
    }
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

  selectBase(selectedBaseOption: BaseOption) {
    if (this.selectedItem.base.selectedBase === selectedBaseOption) {
      return;
    }

    this.selectedItem.base.options.forEach((option) => {
      option.selected = false;
    });

    selectedBaseOption.selected = true;
    this.selectedItem.base.selectedBase = selectedBaseOption;

    this.recalculatePrice();
  }

  toggleTopping(topping: Option) {
    topping.selected = !topping.selected;

    this.selectedItem.extraToppings.selectedCount =
      this.selectedItem.extraToppings.options.filter((t) => t.selected).length;

    const max = this.selectedItem.extraToppings.maxSelect || 0;

    if (
      topping.selected &&
      max > 0 &&
      this.selectedItem.extraToppings.selectedCount > max
    ) {
      topping.selected = false;
      this.selectedItem.extraToppings.selectedCount--;
      console.warn(`Cannot select more than ${max} extra toppings.`);
    }
    this.recalculatePrice();
  }

  toggleSauce(sauce: Option) {
    sauce.selected = !sauce.selected;

    this.selectedItem.extraSwirlsSauces.selectedCount =
      this.selectedItem.extraSwirlsSauces.options.filter(
        (s) => s.selected
      ).length;

    const max = this.selectedItem.extraSwirlsSauces.maxSelect || 0;

    if (
      sauce.selected &&
      max > 0 &&
      this.selectedItem.extraSwirlsSauces.selectedCount > max
    ) {
      sauce.selected = false;
      this.selectedItem.extraSwirlsSauces.selectedCount--;
      console.warn(`Cannot select more than ${max} extra swirls/sauces.`);
    }
    this.recalculatePrice();
  }

  recalculatePrice() {
    let totalPrice = 0;

    if (this.selectedItem.base.selectedBase) {
      totalPrice = this.selectedItem.base.selectedBase.price;
    } else {
      totalPrice = this.selectedItem.basePrice;
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
    const selectedToppings = this.selectedItem.extraToppings.options.filter(
      (t) => t.selected
    );
    const selectedSwirlsSauces =
      this.selectedItem.extraSwirlsSauces.options.filter((s) => s.selected);
    const removedIngredients = this.selectedItem.ingredients.options.filter(
      (i) => !i.selected
    );

    const ingredientsSummary =
      `Base: ${this.selectedItem.base.selectedBase?.name || "N/A"}` +
      (selectedToppings.length > 0
        ? `, Toppings: ${selectedToppings.map((t) => t.name).join(", ")}`
        : "") +
      (selectedSwirlsSauces.length > 0
        ? `, Sauces: ${selectedSwirlsSauces.map((s) => s.name).join(", ")}`
        : "") +
      (removedIngredients.length > 0
        ? `, Removed: ${removedIngredients.map((i) => i.name).join(", ")}`
        : "");

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
      selectedToppings: selectedToppings.map((t) => ({
        name: t.name,
        price: t.price,
      })),
      selectedSwirlsSauces: selectedSwirlsSauces.map((s) => ({
        name: s.name,
        price: s.price,
      })),
      removedIngredients: removedIngredients.map((i) => ({ name: i.name })),
    };

    this.itemAdded.emit(cartItem);
    this.closePopup();
    console.log("Dish added to cart:", cartItem);
  }

  addMedia() {}

  dishSelector(i: number) {}
}