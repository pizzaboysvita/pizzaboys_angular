import {
  EventEmitter,
  Output,
  ViewChild,
  Component,
  ChangeDetectorRef,
  ElementRef,
  OnInit,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { FormsModule as NgFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/services/common.service";
import { CommonModule } from "@angular/common";
import { ApisService } from "../../shared/services/apis.service";

@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
  standalone: true,
  imports: [CommonModule, NgFormsModule, NgbDropdownModule],
})
export class MediaComponent implements OnInit {
  @Output() itemAdded = new EventEmitter<any>();
  @Output() itemDecreased = new EventEmitter<any>();
  @Output() popupClosed = new EventEmitter<void>();

  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;

  isOptionSelected: boolean = false;
  selectedCategory: any;
  categoriesList: any[] = [];
  dishList: any[] = [];
  selectedItemForModal: any | null = null;
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
  cartItems: any[] = [];
  totalPrice: any;
  activeSubmenu: any;
  openComboIndex: number | null = null;
  hoveredComboIndex: number | null = null;
  mainItems = [];

  optionGroups: any = [];
  dishnote = "";
  comboDishDetails: any = [];
  totalDishList: any[] = [];
  selectedChildPerCombo: { [comboIndex: number]: any } = {};
  isEditing: boolean = false;
  private subscription!: Subscription;
  selectedDish: any;

  constructor(
    public modal: NgbModal,
    private apiService: ApisService,
    private sessionStorageService: SessionStorageService,
    private cdr: ChangeDetectorRef,
    private CommonService: CommonService
  ) {}

  ngOnInit() {
    this.subscription = this.CommonService.dishes$.subscribe((data: any) => {
      this.dishList = data;
    });
    this.subscription = this.CommonService.totalDishList$.subscribe(
      (data: any) => {
        this.totalDishList = data;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scrollLeft() {
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollBy({
        left: -150,
        behavior: "smooth",
      });
  }
  scrollRight() {
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollBy({
        left: 150,
        behavior: "smooth",
      });
  }

  selectCategory(category: any) {
    this.dishList = category.dishes;
    this.selectedCategory = category;
    this.cdr.detectChanges();
  }

  searchTerm(term: string) {
    this.cdr.detectChanges();
  }

  decreaseItem(item: any): void {
    if (item.quantity && item.quantity > 0) {
      item.quantity--;
      this.cdr.detectChanges();
      const simplifiedCartItem: any = {
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

  async openEditPopup(item: any) {
    this.isEditing = true;
    this.isOptionSelected = true;
    this.selectedChildPerCombo = {};

    // CASE 1: STANDARD DISH EDIT

    if (item.dish_type !== "combo") {
      const dish = this.totalDishList.find((d) => d.dish_id == item.dish_id);
      const converted = this.apiService.convertDishObject(dish);

      converted.dish_quantity = item.dish_quantity;
      converted.unique_key = item.unique_key;

      // READ SAVED OPTION SETS
      const savedSets = Array.isArray(item.standed_option_selected_array)
        ? item.standed_option_selected_array
        : [];

      if (
        Array.isArray(savedSets) &&
        Array.isArray(converted.dish_option_set_array)
      ) {
        converted.dish_option_set_array.forEach((optSet: any) => {
          const optSetLabel =
            optSet.display_name || optSet.dispaly_name || optSet.name;

          const savedGroup = savedSets.find(
            (s: any) => s.dish_opt_type === optSetLabel
          );

          if (!savedGroup) return;

          const chosenOptions = Array.isArray(savedGroup.choose_option)
            ? savedGroup.choose_option
            : [];

          const targetOptions = Array.isArray(optSet.option_set_array)
            ? optSet.option_set_array
            : [];

          if (!chosenOptions.length || !targetOptions.length) return;

          chosenOptions.forEach((chosen: any) => {
            const opt = targetOptions.find((o: any) => o.name === chosen.name);
            if (opt) {
              opt.selected = true;
              opt.quantity = chosen.quantity ?? 1;
            }
          });
        });
      }

      // PATCH INGREDIENTS
      const ingredientsGroup = savedSets.find(
        (s: any) => s.dish_opt_type === "Ingredients"
      );

      if (
        ingredientsGroup &&
        Array.isArray(ingredientsGroup.choose_option) &&
        Array.isArray(converted.dish_ingredient_array)
      ) {
        converted.dish_ingredient_array.forEach((ing: any) => {
          const sel = ingredientsGroup.choose_option.find(
            (c: any) => c.name === ing.name
          );
          if (sel) {
            ing.selected = true;
            ing.quantity = sel.quantity ?? 1;
          }
        });
      }

      converted.selectedOptions = [];
      converted.dish_option_set_array.forEach((optSet: any) => {
        optSet.option_set_array.forEach((opt: any) => {
          if (opt.selected) converted.selectedOptions.push(opt);
        });
      });

      this.selectedDishFromList = converted;
      this.showPopup = true;
      this.cdr.detectChanges();
      return;
    }

    // CASE 2: COMBO DISH EDIT

    const mainCombo = this.totalDishList.find((d) => d.dish_id == item.dish_id);
    const convertedMain = this.apiService.convertDishObject(mainCombo);

    convertedMain.dish_quantity = item.dish_quantity;
    convertedMain.unique_key = item.unique_key;

    convertedMain.combo_selected_dishes = item.combo_selected_dishes;
    convertedMain.comboDishList = {};

    // BUILD CHILD DISHES
    for (let i = 0; i < item.combo_selected_dishes.length; i++) {
      const child = item.combo_selected_dishes[i];

      const apiResponse: any = await this.apiService
        .getApi(`/api/dish?dish_id=${child.combo_option_dish_id}&type=web`)
        .toPromise();

      if (!apiResponse?.data?.length) continue;

      const fullChildDish = apiResponse.data[0];
      const convertedChild = this.apiService.convertDishObject(fullChildDish);

      // PATCH OPTION SETS
      if (child.combo_option_selected_array) {
        convertedChild.dish_option_set_array.forEach(
          (optSet: {
            dispaly_name: any;
            display_name: any;
            option_set_array: any[];
          }) => {
            const selectedGroup = child.combo_option_selected_array.find(
              (g: { dish_opt_type: any }) =>
                g.dish_opt_type === optSet.dispaly_name ||
                g.dish_opt_type === optSet.display_name
            );

            if (selectedGroup) {
              selectedGroup.choose_option.forEach(
                (chosen: { name: any; quantity: number }) => {
                  const opt = optSet.option_set_array.find(
                    (o: { name: any }) => o.name === chosen.name
                  );
                  if (opt) {
                    opt.selected = true;
                    opt.quantity = chosen.quantity ?? 1;
                  }
                }
              );
            }
          }
        );
      }

      // PATCH INGREDIENTS
      if (child.dish_ingredient_array) {
        convertedChild.dish_ingredient_array.forEach(
          (ing: { name: any; selected: boolean; quantity: any }) => {
            const selIng = child.dish_ingredient_array.find(
              (i: { name: any }) => i.name === ing.name
            );
            if (selIng) {
              ing.selected = true;
              ing.quantity = selIng.quantity;
            }
          }
        );
      }

      convertedMain.comboDishList[i] = convertedChild;
    }

    // LABEL CHILDREN
    Object.keys(convertedMain.comboDishList).forEach((index) => {
      const child = convertedMain.comboDishList[index];
      child.dish_display_name = child.dish_display_name || child.dish_name;
    });

    let parsed: any[] = [];
    try {
      parsed = JSON.parse(mainCombo.dish_choices_json || "[]");
    } catch (e) {
      parsed = [];
    }

    const filteredChoices = this.filterIndeterminateCategories(parsed);
    convertedMain.dish_choices_json_array = filteredChoices;

    convertedMain.dish_choices_json_array.forEach(
      (choice: any, idx: number) => {
        choice.name = choice.name || `Item ${idx + 1}`;
      }
    );

    this.selectedChildPerCombo = {};

    Object.keys(convertedMain.comboDishList).forEach((idxStr: any) => {
      const idx = Number(idxStr);
      const child = convertedMain.comboDishList[idx];

      this.selectedChildPerCombo[idx] = child;

      const saved = item.combo_selected_dishes[idx];
      if (saved) {
        this.selectedChildPerCombo[idx].combo_option_name =
          saved.combo_option_name || child.combo_option_name;

        this.selectedChildPerCombo[idx].selectedChildIndex =
          saved.selectedChildIndex ?? null;

        this.selectedChildPerCombo[idx].selectedChildLabel =
          saved.combo_option_dish_name || null;
      }
    });

    this.selectedDishFromList = convertedMain;
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  openIngredientsPopup(item: any) {
    this.isEditing = false;
    this.isOptionSelected = false;
    this.selectedChildPerCombo = {};
    item.dishnote = "";

    if (item.dish_type === "combo") {
      const parsedChoices = JSON.parse(item.dish_choices_json || "[]");
      item.dish_choices_json_array =
        this.filterIndeterminateCategories(parsedChoices);

      item.dish_choices_json_array.forEach((choice: any) => {
        choice.menuItems?.forEach((menu: any) => {
          menu.categories?.forEach((cat: any) => {
            cat.dishes?.forEach((dish: any) => {
              dish.selected = false;
              dish.option_set_array?.forEach((opt: any) => {
                opt.selected = false;
                opt.quantity = 0;
              });
            });
          });
        });
      });

      item.dish_quantity = 1;
      item.duplicate_dish_price = item.dish_price;
      this.selectedDishFromList = item;
      this.cartItems = [item];
      this.showPopup = true;
      return;
    }

    this.cartItems = [];
    item.dish_option_set_array.forEach((optionSet: any) => {
      optionSet.option_set_array.forEach((opt: any) => {
        opt.selected = false;
        opt.quantity = 0;
      });
    });
    item.dish_ingredient_array?.forEach((ingredient: any) => {
      ingredient.selected = true;
    });

    item.dish_quantity = 1;
    item.duplicate_dish_price = item.dish_price;
    this.selectedDishFromList = item;
    this.cartItems = [item];
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  filterIndeterminateCategories(menuData: any[]) {
    return menuData.map((menuGroup) => ({
      ...menuGroup,
      menuItems: menuGroup.menuItems.map((menu: any) => ({
        ...menu,
        categories: menu.categories
          .map((cat: any) => {
            const checkedDishes = cat.dishes.filter(
              (dish: any) => dish.checked
            );
            const isIndeterminate =
              checkedDishes.length > 0 &&
              checkedDishes.length < cat.dishes.length;
            const isChecked =
              checkedDishes.length === cat.dishes.length &&
              checkedDishes.length > 0;
            return {
              ...cat,
              dishes: checkedDishes,
              indeterminate: isIndeterminate,
              checked: isChecked,
            };
          })
          .filter((cat: any) => cat.indeterminate || cat.checked),
      })),
    }));
  }

  closePopup() {
    this.showPopup = false;
    this.isEditing = false;
    this.selectedDishFromList = null;
    this.selectedItemForModal = null;
    this.modalNotes = "";
    this.modalQuantity = 1;
    this.expandedIndex = null;
    this.popupClosed.emit();
    this.cdr.detectChanges();
  }

  increaseModalQuantity(item: any) {
    item["dish_quantity"]++;
    this.calculateTotal();
  }
  decreaseModalQuantity(item: any) {
    if (item["dish_quantity"] > 1) {
      item["dish_quantity"]--;
      this.calculateTotal();
    }
  }

  increment(option: any) {
    this.showPopup = true;
    option.quantity = (option.quantity || 0) + 1;
    if (option.quantity > 0) option.selected = true;
    this.calculateTotal();
  }
  decrement(option: any) {
    if (option.quantity > 0) option.quantity--;
    if (option.quantity == 0) option.selected = false;
    this.calculateTotal();
    this.cdr.detectChanges();
  }

  selectRadio(group: any, option: any) {
    this.isOptionSelected = true;
    group.option_set_array.forEach(
      (opt: any) => (opt.selected = opt === option)
    );
    option.quantity = 1;
    this.calculateTotal();
    this.cdr.detectChanges();
  }
  toggleCheckbox(option: any) {
    option.selected = !option.selected;
    this.cartItems = [...this.cartItems];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum: any, item: any) => {
      let subtotal = this.apiService.getItemSubtotal(item);

      if (isNaN(subtotal)) subtotal = 0;

      return sum + subtotal;
    }, 0);

    this.cartItems.forEach((item: any) => {
      let itemSubtotal = this.apiService.getItemSubtotal(item);

      if (isNaN(itemSubtotal)) itemSubtotal = 0;

      item.subtotal = Number(itemSubtotal);
      item.duplicate_dish_price = Number(itemSubtotal);

      item.item_total_price = Number(itemSubtotal) * (item.dish_quantity || 1);
    });
  }

  calculateComboPrice(combo: any): number {
    try {
      return this.apiService.combotItemSubtotal(combo) || 0;
    } catch (e) {
      console.error("calculateComboPrice error", e);
      return 0;
    }
  }

  addItemToCart(item: any) {
    const cartItem = this.moveSelectedOptionsToMainObject(item);
    this.itemAdded.emit(cartItem);
  }

  moveSelectedOptionsToMainObject(dish: any) {
    const selectedOptions: any[] =
      dish.dish_option_set_array?.flatMap((optionSet: any) =>
        optionSet.option_set_array.filter((opt: any) => opt.selected === true)
      ) || [];
    dish.selectedOptions = selectedOptions;
    return dish;
  }

  selectChild(
    parentIndex: number,
    dish: any,
    comboIndex: number,
    combo_option_details: any
  ) {
    if (!this.selectedChildPerCombo[comboIndex])
      this.selectedChildPerCombo[comboIndex] = {};
    this.comboDishDetails = [];
    this.comboDishDetails = this.totalDishList.filter(
      (d: any) => d.dish_id == dish.dishId
    );
    this.comboDishDetails.forEach((comboDish: any, idx: number) => {
      this.selectedChildPerCombo[comboIndex] =
        this.apiService.convertDishObject(comboDish);
    });

    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      comboDishList: this.selectedChildPerCombo,
    };
    this.selectedChildPerCombo[comboIndex].combo_option_name =
      combo_option_details.name;
    this.selectedChildPerCombo[comboIndex].selectedChildIndex = parentIndex;
    this.selectedChildPerCombo[comboIndex].selectedChildLabel = dish;

    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      duplicate_dish_price: this.calculateComboPrice(this.selectedDishFromList),
    };
    this.cdr.detectChanges();
  }

  combo_selectRadio(
    option: any,
    dishOptionSet: any,
    comboIndex: any,
    fullcomboDetails: any
  ) {
    this.isOptionSelected = true;
    const comboDishDetails = this.selectedDishFromList.comboDishList[
      comboIndex
    ].dish_option_set_array.filter(
      (optSet: any) => optSet.option_set_id === dishOptionSet.option_set_id
    )[0].option_set_array;
    comboDishDetails.forEach((opt: any) => {
      opt.quantity = 1;
      opt.value = option.name;
      opt.selected = opt === option;
    });
    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      duplicate_dish_price: this.calculateComboPrice(this.selectedDishFromList),
    };
    this.cdr.detectChanges();
  }

  getSelectedCount(dishOptionSet: any): number {
    return dishOptionSet.option_set_array.filter(
      (opt: any) => opt.quantity && opt.quantity > 0
    ).length;
  }

  combo_increment(
    option: any,
    dishOptionSet: any,
    comboDishDetails: any,
    fullcomboDetails: any
  ) {
    if (!option.quantity && this.getSelectedCount(dishOptionSet) >= 5) return;
    option.quantity = (option.quantity || 0) + 1;
    if (option.quantity > 0) option.selected = true;
    const subtotal = this.apiService.combotItemSubtotal(fullcomboDetails);
    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      duplicate_dish_price: this.calculateComboPrice(this.selectedDishFromList),
    };
    this.cdr.detectChanges();
  }

  combo_decrement(
    option: any,
    dishOptionSet: any,
    comboDishDetails: any,
    fullcomboDetails: any
  ) {
    if (option.quantity > 0) option.quantity--;
    if (option.quantity == 0) option.selected = false;
    const subtotal = this.apiService.combotItemSubtotal(fullcomboDetails);
    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      duplicate_dish_price: this.calculateComboPrice(this.selectedDishFromList),
    };
  }

  combo_Increment_Quantity(option: any) {
    option.dish_quantity = (option.dish_quantity || 0) + 1;
    const subtotal = this.apiService.combotItemSubtotal(option);
    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      duplicate_dish_price: this.calculateComboPrice(this.selectedDishFromList),
    };
    this.cdr.detectChanges();
  }
  combo_decrement_Quantity(option: any) {
    if (option.dish_quantity > 1) option.dish_quantity--;
    const subtotal = this.apiService.combotItemSubtotal(option);
    this.selectedDishFromList = {
      ...this.selectedDishFromList,
      duplicate_dish_price: this.calculateComboPrice(this.selectedDishFromList),
    };
    this.cdr.detectChanges();
  }

  comboSelectedOptions(fullcomboDetails: any) {
    let selectedOptions: any[] = [];
    if (
      fullcomboDetails &&
      typeof fullcomboDetails.comboDishList === "object"
    ) {
      selectedOptions = Object.values(fullcomboDetails.comboDishList)
        .flatMap((dish: any) => dish.dish_option_set_array)
        .flatMap((optSet: any) => optSet.option_set_array)
        .filter((option: any) => option.selected === true);
    }
    fullcomboDetails.selectedOptions = selectedOptions;
    const combo_selected_dishes = fullcomboDetails.comboDishList
      ? Object.keys(fullcomboDetails.comboDishList).map((idx) => {
          const child = fullcomboDetails.comboDishList[idx];
          const selected_array = (child.dish_option_set_array || []).map(
            (optSet: any) => ({
              dish_opt_type:
                optSet.display_name || optSet.dispaly_name || optSet.name,
              choose_option: (optSet.option_set_array || [])
                .filter((o: any) => o.selected)
                .map((o: any) => ({
                  name: o.name,
                  price: o.price ?? 0,
                  quantity: o.quantity ?? 1,
                })),
            })
          );
          const ingredients = (child.dish_ingredient_array || [])
            .filter((ig: any) => ig.selected)
            .map((ig: any) => ({
              name: ig.name,
              price: ig.price ?? 0,
              quantity: 1,
            }));
          if (ingredients.length)
            selected_array.push({
              dish_opt_type: "Ingredients",
              choose_option: ingredients,
            });
          return {
            combo_option_name: child.combo_option_name || `Item ${idx}`,
            combo_option_dish_id: child.dish_id,
            combo_option_dish_name: child.dish_name,
            combo_option_selected_array: selected_array,
          };
        })
      : [];

    fullcomboDetails.combo_selected_dishes = combo_selected_dishes;
    fullcomboDetails.combo_display_array = Object.keys(
      fullcomboDetails.comboDishList
    ).map((idx) => {
      const child = fullcomboDetails.comboDishList[idx];
      return {
        slot_name: child.combo_option_name,
        dish_name: child.dish_display_name,
      };
    });
    return fullcomboDetails;
  }
  comboAddItemToCart(item: any) {
    const cartItem = this.comboSelectedOptions(item);
    cartItem.unique_key = item.unique_key || `combo_${Date.now()}`;
    cartItem.dish_type = "combo";
    cartItem.dish_id = item.dish_id;
    cartItem.dish_name = item.dish_name;
    cartItem.dish_quantity = item.dish_quantity || 1;

    // Use central combo price calculator
    const comboPrice = this.calculateComboPrice(item);
    cartItem.dish_price = comboPrice;
    cartItem.item_total_price = comboPrice * (item.dish_quantity || 1);

    cartItem.combo_display_array = (item.combo_selected_dishes || []).map(
      (slot: any, idx: number) => ({
        slot_name: slot.combo_option_name,
        dish_name: slot.combo_option_dish_name,
        dish_image: slot.combo_option_dish_image,
      })
    );

    this.itemAdded.emit(cartItem);
  }

  openComboSelectionPopup(comboItem: any) {
    const fullComboDish = this.totalDishList.find(
      (d: any) => d.dish_id == comboItem.dish_id
    );
    if (!fullComboDish) {
      console.error("Combo dish not found in totalDishList:", comboItem);
      return;
    }
    const converted = this.apiService.convertDishObject(fullComboDish);
    converted.dish_type = "combo";
    converted.dish_quantity = 1;
    converted.duplicate_dish_price = converted.dish_price;
    converted.comboDishList = {};
    this.selectedDishFromList = converted;
    this.showPopup = true;
    this.cdr.detectChanges();
  }
}
