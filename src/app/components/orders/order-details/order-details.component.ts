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
  deliveryfee: number = 5.9;
  modalRef: any;
  paymentdetails: any;
  comboOrderDetails: any[] = [];
  totalPrice: number = 0;

  isEditing: boolean = false;

  customer = { name: "", email: "", phone: "" };

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
  }
  ngAfterViewInit() {
    this.setupAddressAutocompleteObserver();
  }

  private initializeForms(): void {
    this.orderForm = this.fb.group({
      orderType: ["PICKUP", Validators.required],
      deliveryAddress: [""],
      streetNumber: [""],
      streetName: [""],
      unitNumber: [""],
      deliveryNote: [""],
    });
    this.orderdueForm = this.fb.group({
      orderDue: ["ASAP", Validators.required],
      orderDateTime: [new Date(), Validators.required],
    });
    this.orderDueDetails = this.orderdueForm.value.orderDue;
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
        const source =
          this.cartItems.find(
            (c) =>
              c.dish_id === t.dish_id &&
              (c.unique_key ? c.unique_key === t.unique_key : true)
          ) || t;

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

  addToCart(item: any) {
    console.log("Add To Cart", item);
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
        this.isEditing = false;
      } else {
        this.cartItems.push({ ...item, unique_key: key });
        this.isEditing = false;
      }
    } else {
      const withKey: CartItem = { ...item, unique_key: key } as any;
      this.cartItems.push(withKey);
    }

    this.rebuildCartView();

    const selectedStandardIds = this.cartItems
      .filter((x: CartItem) => x.dish_type === "standard")
      .map((x: CartItem) => x.dish_id);

    if (selectedStandardIds.length > 1)
      this.checkComboOffer(selectedStandardIds);
    else this.showComboAlert = false;

    this.cartItems = [...this.cartItems];
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(
      (i: CartItem) => i.unique_key !== item.unique_key
    );
    this.rebuildCartView();
  }
  removeItems(item: any) {
    this.cartItems = this.cartItems.filter(
      (cartItem: any) => cartItem.dish_id !== item.dish_id
    );
    this.rebuildCartView();
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
    this.rebuildCartView();
  }
  decreaseModalQuantity(item: any) {
    if (item["dish_quantity"] > 1) {
      item["dish_quantity"]--;
      this.rebuildCartView();
    }
  }

  openNewModelPopup() {
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
  get total(): number {
    const fee =
      this.orderForm.value.orderType === "delivery" ? this.deliveryfee : 0;
    return this.subtotal + this.tax + fee;
  }

  checkComboOffer(selectedDishIds: number[]) {
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
    const user = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user;
    const storeId = user.store_id;
    const q = dishIds.join(",");
    const url = `/api/dish/combo-details?dish_ids=${encodeURIComponent(
      q
    )}&store_id=${storeId}&type=web`;

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

    console.log();

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
      (i: any) => i.selected
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
    this.updateTotals();
  }

  orderList() {
    this.modalService.open(PosOrdersComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "xl",
    });
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
    this.modalRef.componentInstance.totalAmount = this.total;

    this.modalRef.result.then(
      (result: any) => {
        if (!result) return;
        this.paymentdetails = result;
        this.buildServerPayloads();
        const user = JSON.parse(
          this.sessionStorageService.getsessionStorage("loginDetails") as any
        ).user;

        const reqbody: any = {
          total_price: this.subtotal,
          total_quantity: this.cartItems.length,
          store_id: user.store_id,
          order_type:
            this.orderForm.get("orderType")?.value === "PICKUP" ? 1 : 2,
          pickup_datetime: new Date(),
          delivery_address: this.orderForm.get("deliveryAddress")?.value,
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
          order_due: this.orderdueForm.get("orderDue")?.value,
          order_due_datetime: this.orderdueForm.get("orderDateTime")?.value,
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
    this.orderDueDetails =
      this.orderdueForm.value.orderDue === "ASAP"
        ? this.orderdueForm.value.orderDue
        : this.orderdueForm.value.orderDateTime;
    this.showOrderDuePopup = false;
    this.showNewModelPopup = false;
  }
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
    this.Openmodal = true;
  }
  openmodal() {
    this.cashCount = true;
  }

  paymentTab = "discount";
  typeTab = "%";
  modifyValue = "0";
  onKey(key: string) {
    if (this.modifyValue === "0") this.modifyValue = "";
    this.modifyValue += key;
  }
}
