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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CommonModule, FormsModule, NgIf, DecimalPipe],
  standalone: true,
})
export class MediaComponent implements OnInit {
  public searchText: string = "";
  showPopup: boolean = false;

  @Output() itemAdded = new EventEmitter<CartItem>();
  @Output() itemDecreased = new EventEmitter<CartItem>();

  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;
  @ViewChild("modalContent") modalContent!: ElementRef;

  selectedCategory: any;
  categoriesList: any[] = [];
  dishList: DishFromAPI[] = [];

  selectedItemForModal: SelectedDishItemForModal | null = null;
  selectedDishFromList: DishFromAPI | null = null;

  pizzaChoices: string[] = [
    "Large Pizza Choice #1",
    "Large Pizza Choice #2",
    "Large Pizza Choice #3",
  ];
  selectedExpandedChoice: string = "";

  modalNotes: string = "";
  modalQuantity: number = 1;

  expandedIndex: number | null = null;

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
        console.log("Category API Response:", categoryRes);
        console.log("Dish API Response:", dishRes);

        const processedMenu = this.apiService.posMenuTree(
          categoryRes.categories,
          dishRes.data
        );

        this.categoriesList = processedMenu;
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

  selectCategory(category: any) {
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
      this.itemAdded.emit(simplifiedCartItem);
    }
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

  openIngredientsPopup(item: DishFromAPI) {
    this.selectedDishFromList = item;
    this.modalQuantity = 1;
    this.modalNotes = "";
    this.selectedExpandedChoice = "";
    this.expandedIndex = null;

    this.selectedItemForModal = {
      name: item.dish_name,
      basePrice: parseFloat(item.dish_price),
      currentCalculatedPrice: parseFloat(item.dish_price),
      notes: item.notes || "",
      originalDishId: item.dish_id,
      quantity: 1,

      baseOptions: { options: [] },
      extraToppingsOptions: { options: [] },
      extraSwirlsSaucesOptions: { options: [] },
      ingredientsOptions: { options: [] },
    };

    try {
      if (
        item.dish_option_set_json &&
        (item.dish_option_set_json.startsWith("[") ||
          item.dish_option_set_json.startsWith("{"))
      ) {
        const optionSets = JSON.parse(item.dish_option_set_json);
        this.selectedItemForModal.parsedOptionSets = optionSets;

        optionSets.forEach((set: any) => {
          let comboOptionsArray: any[] = [];
          if (
            set.option_set_combo_json &&
            (set.option_set_combo_json.startsWith("[") ||
              set.option_set_combo_json.startsWith("{"))
          ) {
            try {
              comboOptionsArray = JSON.parse(set.option_set_combo_json);
              if (!Array.isArray(comboOptionsArray)) {
                console.warn(
                  `Dish ${item.dish_name} (ID: ${item.dish_id}): option_set_combo_json for "${set.display_name}" parsed to non-array. Value:`,
                  comboOptionsArray
                );
                comboOptionsArray = [];
              }
            } catch (e) {
              console.error(
                `Dish ${item.dish_name} (ID: ${item.dish_id}): Error parsing option_set_combo_json for "${set.display_name}":`,
                e,
                "Raw JSON:",
                set.option_set_combo_json
              );
              comboOptionsArray = [];
            }
          } else if (set.option_set_combo_json) {
            console.warn(
              `Dish ${item.dish_name} (ID: ${item.dish_id}): option_set_combo_json for "${set.display_name}" is malformed (not starting with [ or {): "${set.option_set_combo_json}"`
            );
          }

          const mappedOptions: Option[] = comboOptionsArray.map(
            (opt: any, index: number) => ({
              name: opt.name,
              price: parseFloat(opt.price || "0"),
              selected: opt.selected || false,
              uniqueId: `${set.display_name}-${opt.name}-${index}`,
            })
          );

          if (set.display_name === "Base") {
            this.selectedItemForModal!.baseOptions = {
              options: mappedOptions,
              maxSelect: set.max_select || 1,
              selectedCount: 0,
              required: set.required || false,
            };
            if (
              set.required &&
              mappedOptions.length > 0 &&
              !mappedOptions.some((opt) => opt.selected)
            ) {
              mappedOptions[0].selected = true;
            }
          } else if (set.display_name === "Extra Toppings") {
            this.selectedItemForModal!.extraToppingsOptions = {
              options: mappedOptions,
              maxSelect: set.max_select || Infinity,
              selectedCount: 0,
              required: set.required || false,
            };
          } else if (set.display_name === "Extra Swirls / Sauces") {
            this.selectedItemForModal!.extraSwirlsSaucesOptions = {
              options: mappedOptions,
              maxSelect: set.max_select || Infinity,
              selectedCount: 0,
              required: set.required || false,
            };
          }
          mappedOptions.forEach((opt) => {
            if (opt.selected) {
              if (set.display_name === "Base")
                this.selectedItemForModal!.baseOptions.selectedCount!++;
              else if (set.display_name === "Extra Toppings")
                this.selectedItemForModal!.extraToppingsOptions
                  .selectedCount!++;
              else if (set.display_name === "Extra Swirls / Sauces")
                this.selectedItemForModal!.extraSwirlsSaucesOptions
                  .selectedCount!++;
            }
          });
        });
      } else if (item.dish_option_set_json) {
        console.warn(
          `Dish ${item.dish_name} (ID: ${item.dish_id}) has malformed dish_option_set_json (not starting with [ or {): "${item.dish_option_set_json}"`
        );
      }

      if (
        item.dish_ingredients_json &&
        (item.dish_ingredients_json.startsWith("[") ||
          item.dish_ingredients_json.startsWith("{"))
      ) {
        const ingredients = JSON.parse(item.dish_ingredients_json);
        this.selectedItemForModal.parsedIngredients = ingredients;

        if (Array.isArray(ingredients)) {
          this.selectedItemForModal.ingredientsOptions = {
            options: ingredients.map((ing: any, index: number) => ({
              name: ing.name,
              price: 0,
              selected: ing.selected || true,
              uniqueId: `ingredient-${ing.name}-${index}`,
            })),
          };
        } else {
          console.warn(
            `Dish ${item.dish_name} (ID: ${item.dish_id}): dish_ingredients_json parsed to non-array:`,
            ingredients
          );
        }
      } else if (item.dish_ingredients_json) {
        console.warn(
          `Dish ${item.dish_name} (ID: ${item.dish_id}) has malformed dish_ingredients_json (not starting with [ or {): "${item.dish_ingredients_json}"`
        );
      }
    } catch (e) {
      console.error(
        "Error parsing dish JSONs (outer try-catch caught syntax error or unexpected structure):",
        e
      );
    }

    this.calculateModalPrice();
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  closePopup() {
    this.showPopup = false;
    this.selectedDishFromList = null;
    this.selectedItemForModal = null;
    this.modalNotes = "";
    this.modalQuantity = 1;
    this.expandedIndex = null;
    this.selectedExpandedChoice = "";
    this.cdr.detectChanges();
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    this.cdr.detectChanges();
  }

  selectExpandedChoice(choice: string): void {
    if (this.selectedExpandedChoice === choice) {
      this.selectedExpandedChoice = "";
    } else {
      this.selectedExpandedChoice = choice;
    }
    this.cdr.detectChanges();
  }

  updateOptionSelection(
    optionSetType: keyof SelectedDishItemForModal,
    option: Option
  ): void {
    if (!this.selectedItemForModal) return;

    const optionSet = this.selectedItemForModal[optionSetType] as ItemOptions;

    if (!optionSet || !optionSet.options) return;

    if (optionSetType === "baseOptions") {
      optionSet.options.forEach((o) => (o.selected = false));
      option.selected = true;
      optionSet.selectedCount = 1;
    } else {
      if (option.selected) {
        option.selected = false;
        optionSet.selectedCount = (optionSet.selectedCount || 0) - 1;
      } else {
        if (
          optionSet.maxSelect &&
          (optionSet.selectedCount || 0) >= optionSet.maxSelect
        ) {
          console.warn(
            `Cannot select more than ${optionSet.maxSelect} options for ${optionSetType}`
          );
          return;
        }
        option.selected = true;
        optionSet.selectedCount = (optionSet.selectedCount || 0) + 1;
      }
    }
    this.calculateModalPrice();
    this.cdr.detectChanges();
  }

  decreaseModalQuantity(): void {
    if (this.modalQuantity > 1) {
      this.modalQuantity--;
      this.calculateModalPrice();
      this.cdr.detectChanges();
    }
  }

  increaseModalQuantity(): void {
    this.modalQuantity++;
    this.calculateModalPrice();
    this.cdr.detectChanges();
  }

  calculateModalPrice(): void {
    if (!this.selectedItemForModal) {
      return;
    }

    let currentPrice = this.selectedItemForModal.basePrice;

    const selectedBase = this.selectedItemForModal.baseOptions.options.find(
      (opt) => opt.selected
    );
    if (selectedBase && selectedBase.price !== undefined) {
      currentPrice += selectedBase.price;
    }

    this.selectedItemForModal.extraToppingsOptions.options.forEach((opt) => {
      if (opt.selected && opt.price !== undefined) {
        currentPrice += opt.price;
      }
    });

    this.selectedItemForModal.extraSwirlsSaucesOptions.options.forEach(
      (opt) => {
        if (opt.selected && opt.price !== undefined) {
          currentPrice += opt.price;
        }
      }
    );

    this.selectedItemForModal.currentCalculatedPrice =
      currentPrice * this.modalQuantity;
    this.cdr.detectChanges();
  }

  addConfiguredDish(): void {
    if (!this.selectedItemForModal || !this.selectedDishFromList) {
      console.error("No item selected for configuration.");
      return;
    }

    const hasBaseSelected =
      this.selectedItemForModal.baseOptions.required &&
      this.selectedItemForModal.baseOptions.options.length > 0 &&
      !this.selectedItemForModal.baseOptions.options.some(
        (opt) => opt.selected
      );

    if (hasBaseSelected) {
      console.warn("Please select a base option.");
      return;
    }

    let ingredientsSummary = "";
    const selectedBase = this.selectedItemForModal.baseOptions.options.find(
      (opt) => opt.selected
    );
    if (selectedBase) {
      ingredientsSummary += `Base: ${selectedBase.name}`;
    }

    const selectedToppings =
      this.selectedItemForModal.extraToppingsOptions.options.filter(
        (opt) => opt.selected
      );
    if (selectedToppings.length > 0) {
      ingredientsSummary += `${
        ingredientsSummary ? ", " : ""
      }Toppings: ${selectedToppings.map((t) => t.name).join(", ")}`;
    }

    const selectedSwirlsSauces =
      this.selectedItemForModal.extraSwirlsSaucesOptions.options.filter(
        (opt) => opt.selected
      );
    if (selectedSwirlsSauces.length > 0) {
      ingredientsSummary += `${
        ingredientsSummary ? ", " : ""
      }Swirls/Sauces: ${selectedSwirlsSauces.map((s) => s.name).join(", ")}`;
    }

    const removedIngredients =
      this.selectedItemForModal.ingredientsOptions.options.filter(
        (opt) => !opt.selected
      );
    if (removedIngredients.length > 0) {
      ingredientsSummary += `${
        ingredientsSummary ? ", " : ""
      }Removed: ${removedIngredients.map((r) => r.name).join(", ")}`;
    }

    const configuredCartItem: CartItem = {
      name: this.selectedItemForModal.name,
      price: this.selectedItemForModal.currentCalculatedPrice,
      quantity: this.modalQuantity,
      Ingredients: ingredientsSummary,
      title: this.selectedCategory ? this.selectedCategory.name : "Custom Dish",
      status: this.selectedDishFromList.status,
      dishId: this.selectedItemForModal.originalDishId,
      notes: this.modalNotes,
      modalSelectedBaseChoice: this.selectedExpandedChoice,
      selectedBaseOption: selectedBase
        ? { name: selectedBase.name, price: selectedBase.price || 0 }
        : undefined,
      selectedToppings: selectedToppings.map((t) => ({
        name: t.name,
        price: t.price,
      })),
      selectedSwirlsSauces: selectedSwirlsSauces.map((s) => ({
        name: s.name,
        price: s.price,
      })),
      removedIngredients: removedIngredients.map((r) => ({ name: r.name })),
    };

    console.log("Configured dish added to cart:", configuredCartItem);
    this.itemAdded.emit(configuredCartItem);
    this.closePopup();
  }

  trackByCategory(index: number, category: any): number {
    return category.category_id;
  }

  trackByDish(index: number, dish: DishFromAPI): number {
    return dish.dish_id;
  }

  trackByOption(index: number, option: Option): string {
    return option.uniqueId || index.toString();
  }
}
