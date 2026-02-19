import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { GoogleMap, GoogleMapsModule } from "@angular/google-maps";
import { ToastrService } from "ngx-toastr";

import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { MediaComponent } from "../../media/media.component";
import { PosOrdersComponent } from "../pos-orders/pos-orders.component";
import { OrderPaymentsComponent } from "../order-payments/order-payments.component";
import { ComboAlertComponent } from "../combo-alert/combo-alert.component";
import { ComboSelectionComponent } from "../combo-selection/combo-selection.component";
import { CommonModule as NgCommon } from "@angular/common";
import { CommonService } from "../../../shared/services/common.service";
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

export interface ComboItem {
  dish_id: number;
  dish_name: string;
  dish_image?: string;
}
export interface MatchingCombo {
  combo_id: number;
  combo_dish_id: number;
  combo_name: string;
  combo_price: number | string;
  items: ComboItem[];
}

export interface CartItem {
  dish_id: number;
  dish_name: string;
  dish_price: number;
  dish_quantity: number;
  dish_type: "standard" | "combo" | string;
  unique_key?: string;
  [key: string]: any;
}

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"],
  standalone: true,
  imports: [
    NgCommon,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    GoogleMapsModule,
    MediaComponent,
    ComboAlertComponent,
    ComboSelectionComponent,
  ],
})
export class OrderDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild("addressInput", { static: false }) addressInput!: ElementRef;
  @ViewChild(MediaComponent) mediaComponent!: MediaComponent;
  @ViewChild(GoogleMap) map!: GoogleMap;

  public active = 1;
  public markers: any[] = [];
  public zoom: number = 3;

  showOrderDuePopup = false;
  showCustomerModal = false;
  showNewModelPopup = false;

  selected: "dinein" | "delivery" = "dinein";

  cartItems: CartItem[] = [];
  Openmodal = false;
  totalCartDetails: any[] = [];
  comboDishDetails: any[] = [];
  matchingCombos: MatchingCombo[] = [];
  comboMessage: string = "";
  showComboAlert: boolean = false;
  showComboSelection: boolean = false;
  selectedComboItem: any = null;
  cashCount = false;

  comboGroups: any[] = [];
  comboName: string = "";
  comboPrice: number = 0;
  comboId: number | null = null;
  convertedDish: any[] = [];

  orderForm!: FormGroup;
  orderdueForm!: FormGroup;
  orderDueDetails: any;
  orderItemsDetails: any[] = [];
  toppingDetails: any;
  ingredients_details: any;
  // deliveryfee: number = 5.9;
   deliveryfee: number = 0;

  modalRef: any;
  paymentdetails: any;
  comboOrderDetails: any[] = [];
  totalPrice: number = 0;

  isEditing: boolean = false;

  customer = { name: "", email: "", phone: "" };
  showOrderLaterPopup: boolean;
  selectedScheduleItem: any;
  skipAvailabilityCheck: boolean;
  pendingCartItem: any;
  baseTotal = 0;        // original total
  discountValue = 0;   // entered value (number)
  discountAmount = 0;  // calculated amount
  isDiscountApplied = false;
  surchargeAmount=0;
  discountPercent: number | null = null;
  discounts: any = [];
  surcharges: any = [];

searchControl = new FormControl('');
searchResults: any[] = [];
  selectedUser: any;


  constructor(
    private apiService: ApisService,
    private CommonService: CommonService,
    private fb: FormBuilder,
    private el: ElementRef,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.loadInitialData();
   this.searchControl.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    filter((value): value is string => !!value && value.length >= 3),
    switchMap(async (value) => this.searchUser(value))
  ).subscribe({
    next: (res: any) => {
      this.searchResults = res?.data || res;
      console.log(this.searchResults);
      
    },
    error: () => {
      this.searchResults = [];
    }
  });
  }
  ngAfterViewInit() {
    this.setupAddressAutocompleteObserver();
  }
searchUser(keyword: string) {
  console.log(keyword);
    this.apiService.getApi(`/api/user/address?phone_number=${keyword}`).subscribe({
      next: (res: any) => {
         this.searchResults = res?.data || [];
  //         const data = res?.data || [];

  // // Remove duplicate phone numbers
  // const unique = data.filter(
  //   (item: any, index: number, self: any[]) =>
  //     index === self.findIndex(u => u.phone_number === item.phone_number)
  // );

  // this.searchResults = unique;

      },
      error: (err: any) => {
        console.error("Failed to fetch combo details", err);
        this.searchResults=[]
        
      },
    });
}
showconfirmModelPopup=false
selectUser(user: any) {
  this.searchControl.setValue(user.phone_number); // show phone in input
  this.searchResults = [];
  this.selectedUser = user;   // store full user data
  this.showconfirmModelPopup = true; // open modal

}
confirmCustomer() {
  this.showconfirmModelPopup = false;
  this.customer.name =
    this.selectedUser?.first_name + ' ' + this.selectedUser?.last_name;

  // this.customer.email = this.selectedUser?.email;
  this.customer.phone = this.selectedUser?.phone_number;
  // this.orderForm.patchValue({
  //   deliveryAddress: address
  // });
   this.orderForm.patchValue({
  name: this.selectedUser?.first_name + ' ' + this.selectedUser?.last_name})
     this.orderForm.patchValue({
  phone: this.selectedUser?.phone_number})
  this.orderForm.patchValue({
  email: this.selectedUser?.email})
    if(this.orderForm.get('orderType')?.value === 'delivery'){
  this.orderForm.patchValue({
  deliveryAddress:
    // this.selectedUser?.address_line_1 + ', ' +
    this.selectedUser?.street_address + ', ' +
    this.selectedUser?.city + ', ' +
    this.selectedUser?.state + ' ' +
    this.selectedUser?.country + ' '+
    this.selectedUser?.postal_code
});
  }
  this.searchResults = [];
   this.searchControl.reset('', { emitEvent: false });
  

}

  private initializeForms(): void {
    this.orderForm = this.fb.group({
      orderType: ["PICKUP", Validators.required],
      deliveryAddress: [""],
      streetNumber: [""],
      streetName: [""],
      unitNumber: [""],
      deliveryNote: [""],
      orderDue: ["ASAP", Validators.required],
      orderDateTime: [new Date(), Validators.required],
      name:[''],
      phone:[''],
      email:['']
    });
    // this.orderdueForm = this.fb.group({
    //   orderDue: ["ASAP", Validators.required],
    //   orderDateTime: [new Date(), Validators.required],
    // });
    // this.orderDueDetails = this.orderdueForm.value.orderDue;
  }

  private loadInitialData(): void {
    const user = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user;
    const userId = user.store_id;

    this.markers.push({
      position: { lat: 20.5937, lng: 78.9629 },
      label: { color: "black", text: "India" },
      Option: {
        draggable: true,
        animation: (window as any).google?.maps?.Animation?.DROP,
      },
    });

    this.apiService
      .getApi("/api/dish?store_id=" + userId + "&typeOfDish=combo")
      .subscribe({
        next: (res: any) => {
          this.comboDishDetails = res.data || [];
          console.log("comboDishDetails loaded", this.comboDishDetails);
        },
        error: (err) =>
          console.error("Failed to load initial combo dishes", err),
      });
  }

  private rebuildCartView(): void {
    const transformed = this.apiService.transformData(this.cartItems) || [];

    this.totalCartDetails = transformed.map((t: any) => {
      if (t.dish_type === "combo") {
        // const source =
        //   this.cartItems.find(
        //     (c) =>
        //       c.dish_id === t.dish_id &&
        //       (c.unique_key ? c.unique_key === t.unique_key : true)
        //   ) || t;
          const source =
            this.cartItems.find((c) => c.unique_key === t.unique_key) || t;
        const combo_selected_dishes =
          source["combo_selected_dishes"] || t["combo_selected_dishes"] || [];

        const combo_display_array = combo_selected_dishes.map(
          (cs: any, idx: number) => ({
            slot_name: cs.combo_option_name || `Item ${idx + 1}`,
            dish_name: cs.combo_option_dish_name || "",
          })
        );

        return {
          ...t,
          combo_selected_dishes,
          combo_items: source["combo_items"] || t["combo_items"],
          combo_display_array,
        };
      }

      return t;
    });
    
    this.updateTotals();
  }

  // addToCart(item: any) {
  //   console.log("Add To Cart", item);
  //   const key = item.unique_key || `${item.dish_id}_${Date.now()}`;

  //   if (this.isEditing && item.unique_key) {
  //     const idx = this.cartItems.findIndex(
  //       (ci) => ci.unique_key === item.unique_key
  //     );
  //     if (idx > -1) {
  //       this.cartItems[idx] = {
  //         ...this.cartItems[idx],
  //         ...item,
  //         unique_key: item.unique_key,
  //       };
  //       this.isEditing = false;
  //     } else {
  //       this.cartItems.push({ ...item, unique_key: key });
  //       this.isEditing = false;
  //     }
  //   } else {
  //     const withKey: CartItem = { ...item, unique_key: key } as any;
  //     this.cartItems.push(withKey);
  //   }

  //   this.rebuildCartView();

  //   const selectedStandardIds = this.cartItems
  //     .filter((x: CartItem) => x.dish_type === "standard")
  //     .map((x: CartItem) => x.dish_id);

  //   if (selectedStandardIds.length > 1)
  //     this.checkComboOffer(selectedStandardIds);
  //   else this.showComboAlert = false;

  //   this.cartItems = [...this.cartItems];
  // }
  addToCart(item: any) {
  console.log("Add To Cart", item);

  //  Prevent duplicate dish_id
  const alreadyExists = this.cartItems.some(
    (ci) => ci.dish_id === item.dish_id
  );

  // if (alreadyExists && !this.isEditing) {
  //   console.warn("Dish already added to cart");
  //   return; //  stop here
  // }
  // if (!this.isDishAvailableToday(item)) {
  //   this.openApplicableHourModal(item); // show message
  //   return;
  // }
  if (!this.skipAvailabilityCheck && !this.isDishAvailableToday(item)) {
    this.pendingCartItem = item;      // store item
    this.openApplicableHourModal(item);
    return;
  }
  const key = item.unique_key || `${item.dish_id}_${Date.now()}`;

  if (this.isEditing && item.unique_key) {
    const idx = this.cartItems.findIndex(
      (ci) => ci.unique_key === item.unique_key
    );

    if (idx > -1) {
      this.cartItems[idx] = {
        ...this.cartItems[idx],
        ...item,
        unique_key: item.unique_key,
      };
    }

    this.isEditing = false;
  } else {
    const withKey: CartItem = { ...item, unique_key: key } as any;
    this.cartItems.push(withKey);
  }

  this.rebuildCartView();
  this.cartItems = [...this.cartItems];
  console.log(this.cartItems,);
  
  //  const selectedStandardIds = this.cartItems
  //   .filter((x: CartItem) => x.dish_type === "standard")
  //   .map((x: CartItem) => x.dish_id);

  // if (selectedStandardIds.length > 1)
  //   this.checkComboOffer(selectedStandardIds);
  // else this.showComboAlert = false;
 this.getComboItems(this.cartItems)
}


  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(
      (i: CartItem) => i.unique_key !== item.unique_key
    );
    this.rebuildCartView();
  }
  // removeItems(item: any) {
  //   this.cartItems = this.cartItems.filter(
  //     (cartItem: any) => cartItem.dish_id !== item.dish_id
  //   );
  //   this.rebuildCartView();
  //     this.getComboItems(this.cartItems)

  // }
removeItems(item: any) {
  if (!item) return;

  // Remove only the specific cart row (split or original)
  this.cartItems = this.cartItems.filter(
    (cartItem: any) => cartItem.unique_key !== item.unique_key
  );

  // Rebuild totalCartDetails for UI
  this.rebuildCartView();

  // Update combo items if needed
  this.getComboItems(this.cartItems);
}

  private updateTotals(): void {
    this.totalPrice = this.totalCartDetails.reduce(
      (sum: number, it: any) => sum + this.apiService.getItemSubtotal(it),
      0
    );

    console.log("Updated total price:", this.totalCartDetails, this.totalPrice);
    this.cdr.detectChanges();
  }

  increaseModalQuantity(item: any) {
    item["dish_quantity"] = (item["dish_quantity"] || 0) + 1;
      const index = this.cartItems.findIndex(
    i => i.unique_key === item.unique_key
  );

  if (index !== -1) {
    this.cartItems[index].dish_quantity++;
  }

      this.updateTotals()
      this.getComboItems(this.cartItems)

    //  this.rebuildCartView();
  }
  decreaseModalQuantity(item: any) {
    if (item["dish_quantity"] > 1) {
      item["dish_quantity"]--;
       const index = this.cartItems.findIndex(
    i => i.unique_key === item.unique_key
  );

  if (index !== -1 && this.cartItems[index].dish_quantity > 1) {
    this.cartItems[index].dish_quantity--;
  }
      this.updateTotals()
      this.getComboItems(this.cartItems)
      // this.rebuildCartView();
    }
  }

  openNewModelPopup(type:any) {
     this.searchResults = [];
   this.searchControl.reset('', { emitEvent: false });
    if(type=='PICKUP'){
      this.orderForm.get('orderType')?.setValue('pickup')
    }
    else{
      this.orderForm.get('orderType')?.setValue('delivery')
    }
    const orderTypeValue = this.orderForm.get('orderType')?.value;
    this.orderForm.reset({
      orderType: orderTypeValue,   // keep existing value
      orderDue: 'ASAP',            // optional default
      orderDateTime: new Date()    // optional default
    });
    this.showNewModelPopup = true;
  }
  closeNewModelPopup() {
    this.showNewModelPopup = false;
  }

  get subtotal(): number {
    return this.totalCartDetails.reduce(
      (sum: number, item: any) => sum + this.apiService.getItemSubtotal(item),
      0
    );
  }
  get tax(): number {
    return +(this.subtotal * 0.1).toFixed(2);
  }
  // get total(): number {
  //   const fee =
  //     this.orderForm.value.orderType === "delivery" ? this.deliveryfee : 0;
  //   // return this.subtotal + this.tax + fee;
  //    return this.subtotal + fee;

  // }
//   get total(): number {
//   const fee =
//     this.orderForm.value.orderType === 'delivery' ? this.deliveryfee : 0;

//   return this.subtotal + fee - this.discountAmount;
// }
get total(): number {
  const fee =
    this.orderForm.value.orderType === 'delivery' ? this.deliveryfee : 0;

  // return this.subtotal + fee - this.totalDiscount;
  return this.subtotal + fee + this.totalSurcharge - this.totalDiscount;
}

  getComboItems(cartItems: any){
    console.log(cartItems);
    
  const comboDishIdCsv = cartItems
  .filter((item: any) => item.dish_type === 'standard')
  .map((item: any) => {
    const baseType = this.getBaseType(item);
    return `${item.dish_id},${item.dish_quantity},${baseType}`;
  })
  .join('|');
  console.log(comboDishIdCsv);
  
  if (comboDishIdCsv.split('|').length > 1)
    this.checkComboOffer(comboDishIdCsv);
  else this.showComboAlert = false;
  }
getBaseType(cartItem: any): number {

  // 1️⃣ If options exist (Pizza Small / Large)
  if (cartItem.selectedOptions?.length) {
    const selected = cartItem.selectedOptions.find(
      (opt: any) => opt.selected
    );

    return selected?.name?.toLowerCase() === 'small' ? 1 : 2;
  }

  // 2️ Keyword match on category name
  const category = cartItem.category_name?.toLowerCase() || '';
   console.log(category);

  if (category.includes('drink')) {
    return 3; // Drinks (cool drinks, soft drinks, etc.)
  }

  if (category.includes('side')) {
    return 4; // Pizza sides, veg sides, etc.
  }

  // fallback
  return 0;
}

  checkComboOffer(selectedDishIds: any) {
    if (this.isEditing) return;
    this.fetchComboDetails(selectedDishIds);
  }

  private mapApiDataToMatchingCombos(data: any[]): MatchingCombo[] {
    const map = new Map<number, MatchingCombo>();

    data.forEach((row: any) => {
      const comboId = Number(
        row.combo_id ?? row.combo_dish_id ?? row.dish_id ?? 0
      );
      const comboDishId = Number(
        row.combo_dish_id ?? row.combo_id ?? row.dish_id ?? 0
      );
      if (!comboId || !comboDishId) return;

      if (!map.has(comboId)) {
        map.set(comboId, {
          combo_id: comboId,
          combo_dish_id: comboDishId,
          combo_name:
            row.combo_name ||
            row.combo_main_dish_name ||
            row.dish_name ||
            "Combo",
          combo_price: Number(row.combo_price ?? row.dish_price ?? 0),
          items: [],
        });
      }

      const comboObj = map.get(comboId)!;
      const itemDishId = Number(
        row.combo_item_dish_id ?? row.dish_id ?? row.item_dish_id ?? 0
      );
      const itemDishName =
        row.combo_item_dish_name ??
        row.combo_dish_item_name ??
        row.dish_name ??
        "";
      const itemImage = row.dish_image ?? row.image_url ?? "";

      if (itemDishId && !comboObj.items.some((i) => i.dish_id === itemDishId)) {
        comboObj.items.push({
          dish_id: itemDishId,
          dish_name: itemDishName || `ID:${itemDishId}`,
          dish_image: itemImage,
        });
      }
    });

    return Array.from(map.values());
  }

  fetchComboDetails(dishIds: number[]) {
    console.log(dishIds);
    
    const user = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user;
    const storeId = user.store_id;
    // const q = dishIds.join(",");
    const url = `/api/dish/combo-details?combo_dish_id_csv=${dishIds}&store_id=${storeId}&type=web`;

    this.apiService.getApi(url).subscribe({
      next: (res: any) => {
        if (
          res &&
          (res.code === "1" || res.code === 1) &&
          Array.isArray(res.data) &&
          res.data.length
        ) {
          this.matchingCombos = this.mapApiDataToMatchingCombos(res.data);
          if (this.matchingCombos.length > 0) {
            this.comboMessage =
              "Combo offer available. Do you want to choose a combo?";
            this.showComboAlert = true;
          } else {
            this.matchingCombos = [];
            this.showComboAlert = false;
          }
        } else {
          this.matchingCombos = [];
          this.showComboAlert = false;
        }
      },
      error: (err: any) => {
        console.error("Failed to fetch combo details", err);
        this.matchingCombos = [];
        this.showComboAlert = false;
      },
    });
  }

  onComboYes() {
    this.showComboAlert = false;
    this.showComboSelection = true;
  }
  onComboNo() {
    this.showComboAlert = false;
  }
  getDishDetailsForComboItem(dishId: number) {
    const dishUrl = `/api/dish?dish_id=${dishId}&type=web`;
    this.apiService.getApi(dishUrl).subscribe({
      next: (res: any) => {
        console.log("Dish details for combo item:", res);
      },
    });
  }
  onComboSelected(combo: MatchingCombo | null) {
    this.showComboSelection = false;
    if (!combo) return;

    const matchedDishIds = combo.items.map((i) => i.dish_id);
    const userSelectedItems = this.cartItems.filter(
      (i) => i.dish_type === "standard" && matchedDishIds.includes(i.dish_id)
    );

    const uniqueKeysToRemove = userSelectedItems
      .map((u) => u.unique_key)
      .filter(Boolean);
    this.cartItems = this.cartItems.filter(
      (ci) =>
        !(
          ci.dish_type === "standard" &&
          uniqueKeysToRemove.includes(ci.unique_key)
        )
    );

    this.CommonService.totalDishList$.subscribe((data) => {
      // this.totalDishList = data;
      console.log("Total Dish List:", data);
      data.forEach((dish: any) => {
        combo.items.forEach((comboItem: ComboItem, id) => {
          if (dish.dish_id === comboItem.dish_id) {
            console.log("Adding combo item to cart:", dish);
            this.convertedDish[id] = this.apiService.convertDishObject(dish);
          }
        });
      });
    });

    const dishUrl = `/api/dish?dish_id=${combo.combo_dish_id}&type=web`;

    this.apiService.getApi(dishUrl).subscribe({
      next: (res: any) => {
        if (!res?.data?.length) {
          this.toastr.error("Unable to load combo details.");
          this.rebuildCartView();
          return;
        }

        const directCombo = res.data[0];

        let parsedChoices: any[] = [];
        try {
          parsedChoices = JSON.parse(directCombo.dish_choices_json || "[]");
        } catch {
          parsedChoices = [];
        }

        const slotNames = parsedChoices.map(
          (choice: any, idx: number) => choice?.name || `Item ${idx + 1}`
        );

        const comboSelected = userSelectedItems.map(
          (item: any, idx: number) => ({
            combo_option_name: slotNames[idx] || `Item ${idx + 1}`,
            combo_option_dish_id: item.dish_id,
            combo_option_dish_name: item.dish_name,
            combo_option_dish_image: item.dish_image,

            combo_option_selected_array:
              this._buildSelectedArrayFromStandardItem(item),
          })
        );

        const comboPrice = Number(
          directCombo.dish_price ?? combo.combo_price ?? 0
        );

        const comboCartItem: any = {
          ...directCombo,

          dish_id: directCombo.dish_id,
          dish_name: directCombo.dish_name,
          dish_type: "combo",
          dish_quantity: 1,

          dish_price: comboPrice,
          duplicate_dish_price: comboPrice,

          item_total_price: comboPrice * 1,

          unique_key: `combo_${Date.now()}`,

          combo_selected_dishes: comboSelected,
          combo_items: combo.items || [],

          isMatchedCombo: true,
          matchedCombo: combo,
        };

        this.cartItems.push(comboCartItem);
        this.rebuildCartView();
        this.cartItems = [...this.cartItems];
      },

      error: (err: any) => {
        console.error("Error loading real combo dish:", err);
        this.toastr.error("Unable to load combo details.");
        this.rebuildCartView();
      },
    });
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

  private _buildSelectedArrayFromStandardItem(item: any) {
    const result: any[] = [];
    const optionSets = item.dish_option_set_array ?? [];
    optionSets.forEach((optSet: any) => {
      const chosen = (optSet.option_set_array || []).filter(
        (o: any) => o.selected || (o.quantity && o.quantity > 0)
      );
      if (!chosen || chosen.length === 0) return;
      result.push({
        dish_opt_type:
          optSet.display_name || optSet.dispaly_name || optSet.name || "Option",
        choose_option: chosen.map((ch: any) => ({
          name: ch.name,
          price: Number(ch.price ?? 0),
          quantity: ch.quantity ?? 1,
          dish_id: item.dish_id,
          option_id: ch.option_id ?? ch.uniqueId ?? null,
        })),
      });
    });

    const ing = (item.dish_ingredient_array || []).filter(
      (i: any) => !i.selected
    );
    if (ing && ing.length) {
      result.push({
        dish_opt_type: "Ingredients",
        choose_option: ing.map((ig: any) => ({
          name: ig.name,
          price: ig.price ?? 0,
          quantity: 1,
        })),
      });
    }
    return result;
  }

  onPopupClosed() {
    console.log("Popup closed — resetting edit mode");
    this.isEditing = false;
  }
  openComboSelectionModal() {
    this.showComboSelection = true;
  }

  editItem(item: any) {
    this.isEditing = true;
    if (this.mediaComponent) this.mediaComponent.openEditPopup(item);
  }

  clearOrderDetails() {
    this.cartItems = [];
    this.totalCartDetails = [];
    this.matchingCombos = [];
    this.showComboAlert = false;
    this.showComboSelection = false;
    this.surcharges=[]
    this.discounts=[]
    this.updateTotals();
  }

  orderList() {
    this.modalService.open(PosOrdersComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "xl",
    });
  }
getTotalPercentage(): number {
  return this.discounts
    .filter((d: { type: string; }) => d.type === '%')
    .reduce((sum: number, d: { value: any; }) => sum + Number(d.value || 0), 0);
}
getTotalFlatAmount(): number {
  return this.discounts
    .reduce((sum: number, d: { amount: any; }) => sum + Number(d.amount || 0), 0);
}

  submitOrder() {
    if (this.cartItems.length === 0) {
      this.toastr.warning(
        "Cart is empty. Please add items to order.",
        "Cannot Submit"
      );
      return;
    }

    this.modalRef = this.modalService.open(OrderPaymentsComponent, {
      size: "xl",
      centered: true,
    });
    this.modalRef.componentInstance.data = this.totalCartDetails;
    this.modalRef.componentInstance.customer = this.customer;
    this.modalRef.componentInstance.surcharges = this.surcharges;
    this.modalRef.componentInstance.discounts = this.discounts;
    this.modalRef.componentInstance.totalAmount = this.total;
    this.modalRef.componentInstance.deliveryfee = this.deliveryfee;

    this.modalRef.result.then(
      (result: any) => {
        if (!result) return;
        this.paymentdetails = result;
        this.buildServerPayloads();
        const user = JSON.parse(
          this.sessionStorageService.getsessionStorage("loginDetails") as any
        ).user;

        const reqbody: any = {
          discount_percentage:this.getTotalPercentage(),
          discount_amount:this.getTotalFlatAmount(),
          total_price: this.subtotal,
          total_quantity: this.cartItems.length,
          store_id: user.store_id,
          order_type:
            this.orderForm.get("orderType")?.value === "PICKUP" ? 1 : 2,
          pickup_datetime: new Date(),
          delivery_address: this.orderForm.get("deliveryAddress")?.value,
          phone_number:this.orderForm.get("phone")?.value,
          delivery_fees:
            this.orderForm.get("orderType")?.value === "delivery"
              ? this.deliveryfee
              : 0,
          is_pos_order: 1,
          delivery_datetime: new Date(),
          order_notes: this.orderForm.get("deliveryNote")?.value,
          order_status: "Confirmed",
          order_created_by: user.store_id,
          order_details_json: this.orderItemsDetails,
          order_due: this.orderForm.get("orderDue")?.value,
          order_due_datetime: this.orderForm.get("orderDateTime")?.value,
          topping_details: this.toppingDetails,
          ingredients_details: this.ingredients_details,
          unitnumber: this.orderForm.value.unitNumber,
          delivery_notes: this.orderForm.value.deliveryNote,
          gst_price: this.tax,
          combo_order_details: this.comboOrderDetails,
          order_payments_json: this.paymentdetails.order_payments_json,
          payment_split_percentage_json:
            this.paymentdetails.payment_split_percentage_json,
          payment_split_users_json:
            this.paymentdetails.payment_split_users_json,
          payment_split_items_json:
            this.paymentdetails.payment_split_items_json,
        };

        console.log("order reqbody ->", reqbody);

        this.apiService.postApi("/api/order/v2", reqbody).subscribe({
          next: (res: any) => {
            if (res && res.code == 1) {
              this.toastr.success(res.message, "Success");
              this.clearOrderDetails();
              this.customer = { name: "", email: "", phone: "" };
              this.orderForm.reset();
              this.orderForm.get("orderType")?.setValue('PICKUP');
              this.orderForm.get("orderDue")?.setValue('ASAP'); 
              this.orderForm.get("orderDateTime")?.setValue(new Date()); 
              this.deliveryfee=0;
              this.cdr.detectChanges();
            } else {
              this.toastr.error(res?.message || "Order failed", "Error");
            }
          },
          error: (err) => {
            console.error("Order submission API failed:", err);
            this.toastr.error("Server error during order submission.", "Error");
          },
        });
      },
      (reason: any) => {
        console.log("Payment Modal dismissed:", reason);
      }
    );
  }

  private buildServerPayloads(): void {
    this.orderItemsDetails = this.cartItems.map((item: CartItem) => ({
      dish_id: item.dish_id,
      dish_note: item["dishnote"],
      quantity: item.dish_quantity,
      price:
        item["duplicate_dish_price"] || this.apiService.getItemSubtotal(item),
    }));

    this.comboOrderDetails = this.cartItems
      .filter((x: CartItem) => x.dish_type === "combo")
      .map((combo: any) => ({
        combo_id: combo.dish_id,
        combo_name: combo.dish_name,
        combo_price: combo.dish_price,
        selected_groups: combo.combo_selected_dishes || [],
      }));

    this.toppingDetails = this.cartItems.flatMap((dish: any) =>
      (dish.selectedOptions || [])
        .filter((opt: any) => opt.selected)
        .map((opt: any) => ({
          dish_id: dish.dish_id,
          name: opt.name,
          price: opt.price,
          quantity: opt.quantity,
        }))
    );

    this.ingredients_details = this.cartItems.flatMap((dish: any) =>
      (dish["dish_ingredient_array"] || [])
        .filter((opt: any) => opt.selected)
        .map((opt: any) => ({
          dish_id: dish.dish_id,
          name: opt.name,
          price: opt.price,
          quantity: opt.quantity,
        }))
    );
  }

  setupAddressAutocompleteObserver() {
    const observer = new MutationObserver(() => {
      const pac = document.querySelector(".pac-container") as HTMLElement;
      if (pac && this.addressInput) {
        const rect = this.addressInput.nativeElement.getBoundingClientRect();
        pac.style.zIndex = "2000";
        pac.style.position = "fixed";
        pac.style.width = rect.width + "px";
        pac.style.top = rect.bottom + "px";
        pac.style.left = rect.left + "px";
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  getAddressAutocomplete() {
    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      {
        componentRestrictions: { country: "nz" },
        fields: ["formatted_address", "geometry"],
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address)
        this.orderForm.patchValue({ deliveryAddress: place.formatted_address });
    });
  }

  openDeliveryPopup() {
    this.showOrderDuePopup = true;
  }
  closeOrderDuePopup() {
    this.showOrderDuePopup = false;
  }

  submitDUeOrder() {
   this.searchResults=[]
   this.selectedUser=''
     this.customer = {
    name: this.orderForm.get('name')?.value,
    email: this.orderForm.get('email')?.value,
    phone: this.orderForm.get('phone')?.value
  };

    this.showNewModelPopup = false;
    if (this.orderForm.invalid || this.dateError) return;
    this.orderDueDetails =
      this.orderForm.value.orderDue === "ASAP"
        ? this.orderForm.value.orderDue
        : this.orderForm.value.orderDateTime;
    this.showOrderDuePopup = false;
    this.showNewModelPopup = false;
    this.selectedScheduleItem=null
    this.pendingCartItem=null
    this.skipAvailabilityCheck = true;
          if( this.orderForm.value.orderType=='delivery'){
            this.deliveryfee = 5.9;
          }
          else{
                        this.deliveryfee = 0;
          }
    if( this.orderForm.value.orderDue === "Later"){
    this.addToCart(this.pendingCartItem)
    }
    
  }
  // submitLatDUeOrder(){
  //    if (this.orderdueForm.invalid || this.dateError) return;
  //   this.orderDueDetails =
  //     this.orderdueForm.value.orderDue === "ASAP"
  //       ? this.orderdueForm.value.orderDue
  //       : this.orderdueForm.value.orderDateTime;
  //        this.skipAvailabilityCheck = true;
  //   this.addToCart(this.pendingCartItem)
  //   this.showOrderDuePopup = false;
  //   this.showNewModelPopup = false;
  //   this.selectedScheduleItem=null
  //   this.pendingCartItem=null
  // }
  closeCustomerModal() {
    this.showCustomerModal = false;
  }
  openCustomerModal() {
    this.showCustomerModal = true;
  }
  clear() {
    this.customer = { name: "", email: "", phone: "" };
  }
  logCombo(event: any) {
    console.log("PARENT RECEIVED EVENT:", event);
  }
  openholdModal() {
  const stored = localStorage.getItem('heldOrders');
  this.heldOrders = stored ? JSON.parse(stored) : [];
    this.Openmodal = true;
  }
 
openModifyPrice() {
    this.cashCount = true;
  this.baseTotal = this.total; // store original
  this.modifyValue = '';
  this.discountAmount = 0;
  this.isDiscountApplied = false;
}
  isDishAvailableToday(item: any): boolean {
  if (!item?.applicable_hours) {
    // no restriction → available all days
    return true;
  }

  let hours: any[] = [];

  try {
    hours = JSON.parse(item.applicable_hours);
    if (!Array.isArray(hours)) return true;
  } catch {
    return true;
  }

  const today = this.getTodayName().toLowerCase();

  return hours.some(
    h => h.day?.toLowerCase() === today
  );
}
getTodayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}
openApplicableHourModal(item: any) {
  this.selectedScheduleItem=item
  const today = this.getTodayName();
   this.showOrderLaterPopup=true
  // alert(
  //   `This item is not available today (${today}). Please check applicable hours.`
  // );

  // OR open Angular Material / Bootstrap modal instead
}

scheduleLater(){
  this.showOrderDuePopup=true
   this.showOrderLaterPopup=false
   this.orderForm.get('orderDue')?.setValue('Later')

}
// getAllowedDays(item: any): string[] {
//   if (!item?.applicable_hours) return [];

//   try {
//     const parsed =
//       typeof item.applicable_hours === 'string'
//         ? JSON.parse(item.applicable_hours)
//         : item.applicable_hours;

//     if (!Array.isArray(parsed) || !parsed.length) return [];

//     return parsed
//       .map((h: any) => h.day?.toLowerCase())
//       .filter(Boolean);
//   } catch {
//     return [];
//   }
  
// }
 getAllowedDays(item: any): string[] {
    if (!item?.applicable_hours) return [];

    try {
      const parsed =
        typeof item.applicable_hours === 'string'
          ? JSON.parse(item.applicable_hours)
          : item.applicable_hours;

      if (!Array.isArray(parsed) || !parsed.length) return [];

      return parsed
        .map((h: any) => h.day?.toLowerCase())
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  // ✅ ADD THIS METHOD JUST BELOW / ABOVE IT
  getAvailableDaysLabel(item: any): string {
    const days = this.getAllowedDays(item);

    if (!days.length) return 'All days';

    return days
      .map(d => d.charAt(0).toUpperCase() + d.slice(1))
      .join(', ');
  }

  


dateError = false;

validateApplicableDay(event: any) {
  const value = event.target.value;
  if (!value) return;

  const selectedDate = new Date(value);
  const selectedDay = selectedDate
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  const allowedDays = this.getAllowedDays(this.selectedScheduleItem);

  // ✅ No restriction → allow all
  if (!allowedDays.length) {
    this.dateError = false;
    return;
  }

  if (!allowedDays.includes(selectedDay)) {
    this.dateError = true;

    //  Clear invalid date
    this.orderForm.get('orderDateTime')?.setValue(null);
  } else {
    this.dateError = false;
  }
}
// splitItem(item: any) {
//   if (!item || item.dish_quantity < 2 || item.dish_type !== 'combo') return;

//   const index = this.totalCartDetails.findIndex(
//     (i: any) => i.unique_key === item.unique_key
//   );

//   if (index === -1) return;

//   const totalQty = item.dish_quantity;
//   const totalPrice = item.item_total_price;
//   // const unitPrice = totalPrice / totalQty;

//   const newItem = JSON.parse(JSON.stringify(item));

//   // Generate new unique_key for split
//   newItem.unique_key = `${item.unique_key}_${Date.now()}_${Math.random()
//     .toString(36)
//     .substr(2, 5)}`;

//   newItem.dish_quantity = totalQty - 1;
//   newItem.item_total_price = +totalPrice;

//   // Update original
//   this.totalCartDetails[index].dish_quantity = 1;
//   this.totalCartDetails[index].item_total_price = +totalPrice;

//   // Insert new split item
//   this.totalCartDetails.splice(index + 1, 0, newItem);

//   // Refresh cart
//   this.totalCartDetails = [...this.totalCartDetails];
//   this.cartItems = [...this.cartItems, newItem];
// }

// splitItem(item: any) {
//   if (!item || item.dish_quantity < 2 || item.dish_type !== 'combo') return;

//   // find original in totalCartDetails
//   const index = this.totalCartDetails.findIndex(
//     (i: any) => i.unique_key === item.unique_key
//   );
//   if (index === -1) return;

//   const totalQty = item.dish_quantity;
//   const totalPrice = item.item_total_price;
//   // const unitPrice = totalPrice / totalQty;

//   // Deep clone original item
//   const newItem = JSON.parse(JSON.stringify(item));

//   // 🔑 Give new unique key for split item
//   newItem.unique_key = `${item.unique_key}_${Date.now()}_${Math.random()
//     .toString(36)
//     .substr(2, 5)}`;

//   // Set quantities & prices
//   newItem.dish_quantity = totalQty - 1;       // remaining quantity
//   newItem.item_total_price = +totalPrice;

//   // Update original item
//   this.totalCartDetails[index].dish_quantity = 1;    // always 1
//   this.totalCartDetails[index].item_total_price = +totalPrice;

//   // Insert split item after original
//   this.totalCartDetails.splice(index + 1, 0, newItem);

//   // Update cartItems array
//   this.cartItems = [
//     ...this.cartItems.filter((c) => c.unique_key !== item.unique_key),
//     this.totalCartDetails[index],
//     newItem,
//   ];

//   // Force UI refresh
//   this.totalCartDetails = [...this.totalCartDetails];
// }
splitItem(item: any) {
  if (!item || item.dish_type !== 'combo' || item.dish_quantity < 2) return;

  // Find original in totalCartDetails
  const index = this.totalCartDetails.findIndex(
    (i: any) => i.unique_key === item.unique_key
  );
  if (index === -1) return;

  const totalQty = item.dish_quantity;
  const totalPrice = item.item_total_price;
  // const unitPrice = totalPrice / totalQty;

  // Remove original item
  this.totalCartDetails.splice(index, 1);

  // Create split items (qty times)
  const splitItems = Array.from({ length: totalQty }).map(() => {
    const newItem = JSON.parse(JSON.stringify(item));

    newItem.dish_quantity = 1;
    newItem.item_total_price = +totalPrice;
    newItem.unique_key = `${item.dish_id}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    return newItem;
  });

  // Insert all split items at same position
  this.totalCartDetails.splice(index, 0, ...splitItems);

  // Sync cartItems (source of truth)
  this.cartItems = this.cartItems.filter(
    (c: any) => c.unique_key !== item.unique_key
  );
  this.cartItems.push(...splitItems);

  // Force UI refresh
  this.totalCartDetails = [...this.totalCartDetails];
  this.cartItems = [...this.cartItems];
}
holdNote: string = '';
heldOrders: any[] = [];

proceedHoldOrder() {
  if (!this.cartItems.length) return;

  const holdOrder = {
    holdId: Date.now(), // unique
    note: this.holdNote || '',
    items: [...this.cartItems], // clone cart
    createdAt: new Date().toISOString()
  };

  // 🔹 Get existing held orders
  // const stored = localStorage.getItem('heldOrders');
  // this.heldOrders = stored ? JSON.parse(stored) : [];

  // 🔹 Add new hold order
  this.heldOrders.push(holdOrder);
  // 🔹 Save back to storage
  localStorage.setItem('heldOrders', JSON.stringify(this.heldOrders));
  // 🔹 CLEAR CART
  this.cartItems = [];
  this.totalCartDetails=[]
  // localStorage.removeItem('cartItems'); // if cart stored
  // 🔹 Reset note & close modal
  this.holdNote = '';
  this.Openmodal = false
  this.discounts=[];
  this.surcharges=[];
  // this.closeHoldModal();
}
deleteHoldOrder(index: number) {
  this.heldOrders.splice(index, 1);
  // update storage
  localStorage.setItem('holdOrders', JSON.stringify(this.heldOrders));
}
restoreHoldOrder(order: any, index: number) {
  // 1️⃣ Restore items
  order.items.forEach((item: any) => {
    this.cartItems.push({
      ...item,
      unique_key: item.unique_key || `${item.dish_id}_${Date.now()}`
    });
  });

  // 2️⃣ Refresh cart
  this.cartItems = [...this.cartItems];
  this.totalCartDetails = this.cartItems;
  this.rebuildCartView();
  this.getComboItems(this.cartItems);

  // 3️⃣ Remove by index ✅
  this.heldOrders.splice(index, 1);

  // 4️⃣ Sync localStorage (SAME KEY!)
  localStorage.setItem('heldOrders', JSON.stringify(this.heldOrders));

  // 5️⃣ Close modal
  this.Openmodal = false;
}
onTabChange(tab: 'specific' | 'discount' | 'surcharge') {
  this.paymentTab = tab;
    this.discountAmount = 0;
    this.surchargeAmount = 0;
  // reset input
  this.modifyValue = '';
  if (tab === 'specific') {
    this.typeTab = '$'; // force amount
  }
}

// applyModifyPrice() {
//   if (this.paymentTab !== 'discount') return;

//   const value = Number(this.modifyValue || 0);
//   if (value <= 0) return;

//   let amount = 0;

//   if (this.typeTab === '%') {
//     amount = +(this.subtotal * value / 100).toFixed(2);
//   } else {
//     amount = +value.toFixed(2);
//   }

//   // safety
//   if (amount > this.subtotal) {
//     amount = this.subtotal;
//   }

//   this.discounts.push({
//     type: this.typeTab,
//     value,
//     amount
//   });

//   // reset input
//   this.modifyValue = "0";
//   this.cashCount = false;
// }
applyModifyPrice() {
  const value = Number(this.modifyValue || 0);
  if (value <= 0) return;

  let amount = 0;

  // ---------- DISCOUNT ----------
  if (this.paymentTab === 'discount') {
    amount =
      this.typeTab === '%'
        ? +(this.subtotal * value / 100).toFixed(2)
        : +value.toFixed(2);

    // safety: discount cannot exceed subtotal
    if (amount > this.subtotal) {
      amount = this.subtotal;
    }

    this.discounts.push({
      type: this.typeTab,
      value,
      amount
    });
  }

  // ---------- SURCHARGE ----------
  if (this.paymentTab === 'surcharge') {
    amount =
      this.typeTab === '%'
        ? +(this.subtotal * value / 100).toFixed(2)
        : +value.toFixed(2);

    this.surcharges.push({
      type: this.typeTab,
      value,
      amount
    });
  }

  // ---------- RESET ----------
  this.modifyValue = '0';
  this.cashCount = false;
}


paymentTab = "discount";
  typeTab = "%";
  modifyValue = "0";
  // onKey(key: string) {
  //   if (this.modifyValue === "0") this.modifyValue = "";
  //   this.modifyValue += key;
  // }
onKey(n: string) {
  if (this.modifyValue === "0") this.modifyValue = "";
    
  this.modifyValue += n;
  if (this.paymentTab === 'discount') {
    this.calculateDiscount();
  }

  if (this.paymentTab === 'specific') {
    this.calculateSpecific();
  }
    if (this.paymentTab === 'surcharge') {
    this.calculateSurcharge();
  }
}
// specificAmount = 0;
calculateSpecific() {
  const value = Number(this.modifyValue || 0);

  this.discountAmount = value;

  if (this.discountAmount < 0) this.discountAmount = 0;
}

calculateDiscount() {
  const value = Number(this.modifyValue || 0);

  if (this.typeTab === '%') {
    this.discountAmount = +(this.subtotal * value / 100).toFixed(2);
  } else {
    this.discountAmount = +value.toFixed(2);
  }

  // safety
  if (this.discountAmount > this.subtotal) {
    this.discountAmount = this.subtotal;
  }
}
calculateSurcharge() {
  const value = Number(this.modifyValue || 0);

  if (this.typeTab === '%') {
    this.surchargeAmount = +(this.subtotal * value / 100).toFixed(2);
  } else {
    this.surchargeAmount = +value.toFixed(2);
  }

  // safety
  if (this.surchargeAmount > this.subtotal) {
    this.surchargeAmount = this.subtotal;
  }
}
removeDiscount(index: number) {
  this.discounts.splice(index, 1);
}
removeSurcharge(i: number) {
  this.surcharges.splice(i, 1);
}

get totalDiscount(): number {
  if (!this.discounts || this.discounts.length === 0) {
    return 0;
  }

  return this.discounts.reduce((sum: any, d: { amount: any; }) => sum + d.amount, 0);
}
get totalSurcharge(): number {
  if (!this.surcharges || this.surcharges.length === 0) {
    return 0;
  }

  return (this.surcharges || []).reduce((s: any, srg: { amount: any; }) => s + srg.amount, 0);
}


clearValue() {
  this.modifyValue = '0';
  // reset amounts
  this.discountAmount = 0;
  this.surchargeAmount = 0;
}
onTypeChange(type: '$' | '%') {
  if (this.typeTab !== type) {
    // reset when switching type
    this.modifyValue = '0';
    this.discountAmount = 0;
    this.surchargeAmount=0
  }

  this.typeTab = type;
}


}
