// order-details.component.ts
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { GoogleMap, GoogleMapsModule } from "@angular/google-maps";
import { NgbModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { CardComponent } from "../../../shared/components/card/card.component";
import { DetailsComponent } from "./details/details.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { MediaComponent } from "../../media/media.component";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { ToastrService } from "ngx-toastr";
import { PosOrdersComponent } from "../pos-orders/pos-orders.component";
import { OrderPaymentsComponent } from "../order-payments/order-payments.component";
import { ComboAlertComponent } from "../combo-alert/combo-alert.component";
import { ComboSelectionComponent } from "../combo-selection/combo-selection.component";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrl: "./order-details.component.scss",
  imports: [
    NgbNavModule,
    MediaComponent,
    FormsModule,
    ReactiveFormsModule,
    ComboAlertComponent,
    GoogleMapsModule,
    CommonModule,
    ComboSelectionComponent,
  ],
})
export class OrderDetailsComponent {
  @ViewChild("addressInput", { static: false }) addressInput!: ElementRef;
  @ViewChild(MediaComponent) mediaComponent!: MediaComponent;
  @ViewChild(GoogleMap) map!: GoogleMap;

  // UI state
  selected: string = "dinein";
  public active = 1;
  public markers: any[] = [];
  public zoom: number = 3;
  showOrderDuePopup = false;
  showCustomerModal = false;
  showNewModelPopup = false;

  // Cart / combos
  cartItems: any[] = [];
  totalCartDetails: any[] = [];
  totalPrice: number = 0;
  comboDishDetails: any;
  matchingCombos: any[] = [];
  comboMessage: string = "";
  showComboAlert: boolean = false;
  showComboSelection: boolean = false;
  selectedComboItem: any = null;

  // combo modal meta (populated from API)
  comboGroups: any[] = [];
  comboName: string = "";
  comboPrice: number = 0;
  comboId: number | null = null;

  // forms + misc
  orderForm!: FormGroup;
  orderdueForm!: FormGroup;
  orderDueDetails: any;
  orderItemsDetails: any[] = [];
  toppingDetails: any;
  ingredients_details: any;
  deliveryfee: any = 5.9;
  modalRef: any;
  paymentdetails: any;
  comboOrderDetails: any[] = [];

  // edit state
  isEditing: boolean = false;

  // customer
  customer = {
    name: "",
    email: "",
    phone: "",
  };

  filterOptions = ["Cash", "Card", "E-Wallet"];
  selectedOption = "Cash";

  constructor(
    private apiService: ApisService,
    private fb: FormBuilder,
    private el: ElementRef,
    private modal: NgbModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderType: ["pickup", Validators.required],
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

    const userId = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user.store_id;

    this.markers.push({
      position: { lat: 20.5937, lng: 78.9629 },
      label: { color: "black", text: "India" },
      Option: { draggable: true, animation: google.maps.Animation.DROP },
    });

    // initial fetch of combo definitions (optional) - you used it previously
    this.apiService
      .getApi("/api/dish?store_id=" + userId + "&typeOfDish=combo")
      .subscribe((res: any) => {
        this.comboDishDetails = res.data;
        console.log("comboDishDetails", this.comboDishDetails);
      });
  }

  /* ----------------------
     CART: add / update / remove
     ---------------------- */

  addToCart(item: any) {
    console.log("Add To Cart", item);

    const existingIndex = this.cartItems.findIndex(
      (x: any) => x.dish_id === item.dish_id
    );

    // Editing: replace
    if (this.isEditing && existingIndex > -1) {
      this.cartItems[existingIndex] = {
        ...this.cartItems[existingIndex],
        ...item,
        dish_option_set_array: [...(item.dish_option_set_array || [])],
        dish_ingredient_array: [...(item.dish_ingredient_array || [])],
      };
      this.isEditing = false;
    }
    // New: push
    else if (existingIndex === -1) {
      this.cartItems.push({ ...item });
    } else {
      // item exists and not editing -> increment quantity
      // (you previously returned early; to preserve that behaviour, keep returning)
      return;
    }

    // Recalculate view items
    this.totalCartDetails = this.apiService.transformData(this.cartItems);

    // --------- COMBO CHECK ----------
    const selectedStandardIds = this.cartItems
      .filter((x: any) => x.dish_type === "standard")
      .map((x: any) => x.dish_id);

    if (selectedStandardIds.length > 0) {
      this.checkComboOffer(selectedStandardIds);
    }

    this.cartItems = [...this.cartItems];
    this.cdr.detectChanges();
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter((i: any) => i !== item);
    this.totalPrice = this.cartItems.reduce(
      (sum: any, it: any) => sum + this.apiService.getItemSubtotal(it),
      0
    );
  }

  removeItems(item: any) {
    // remove by dish_id from totalCartDetails and cartItems
    this.totalCartDetails = this.totalCartDetails.filter(
      (cartItem: any) => cartItem.dish_id !== item.dish_id
    );

    // recalc duplicates
    this.totalCartDetails.forEach((cartItem: any) => {
      cartItem.duplicate_dish_price = this.apiService.getItemSubtotal(cartItem);
    });

    this.totalPrice = this.totalCartDetails.reduce(
      (sum: any, cartItem: any) => sum + (cartItem.duplicate_dish_price || 0),
      0
    );

    this.cartItems = [...this.totalCartDetails];
    this.cdr.detectChanges();
  }

  increaseModalQuantity(item: any) {
    item["dish_quantity"]++;
  }
  decreaseModalQuantity(item: any) {
    if (item["dish_quantity"] > 1) item["dish_quantity"]--;
  }
  openNewModelPopup() {
    this.showNewModelPopup = true;
  }

  closeNewModelPopup() {
    this.showNewModelPopup = false;
  }

  get subtotal(): number {
    return this.totalCartDetails.reduce(
      (sum: any, item: any) => sum + this.apiService.getItemSubtotal(item),
      0
    );
  }

  get tax(): number {
    return +(this.subtotal * 0.1).toFixed(2);
  }

  get total() {
    const fee =
      this.orderForm.value.orderType == "delivery" ? this.deliveryfee : 0;
    return (
      this.totalCartDetails.reduce(
        (sum: any, item: any) => sum + this.apiService.getItemSubtotal(item),
        0
      ) +
      this.tax +
      fee
    );
  }

  checkComboOffer(selectedDishIds: number[]) {
    if (this.isEditing) return;
    this.fetchComboDetails(selectedDishIds);
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

    this.apiService.getApi(url).subscribe(
      (res: any) => {
        // expected structure: res.code === "1", res.data is array of rows
        if (
          res &&
          (res.code === "1" || res.code === 1) &&
          Array.isArray(res.data) &&
          res.data.length
        ) {
          // transform into grouped combos
          const map = new Map<number, any>();

          res.data.forEach((row: any) => {
            // prefer combo_id; fallback to dish_id
            const comboId =
              row.combo_id || row.combo_dish_id || row.dish_id || 0;
            if (!map.has(comboId)) {
              map.set(comboId, {
                combo_id: comboId,
                combo_name: row.combo_name || row.dish_name || "Combo",
                combo_price: row.combo_price || row.dish_price || 0,
                items: [],
              });
            }

            // Determine item dish id & name & image from possible fields in response
            const itemDishId =
              row.combo_item_dish_id ||
              row.dish_id ||
              row.combo_dish_item_id ||
              row.item_dish_id;
            const itemDishName =
              row.combo_item_dish_name ||
              row.combo_dish_item_name ||
              row.dish_name ||
              (row.items &&
                row.items[0] &&
                (row.items[0].dishName || row.items[0].dish_name)) ||
              "";

            const itemImage = row.dish_image || row.image_url || "";

            // push if not already present
            const comboObj = map.get(comboId);
            const exists = comboObj.items.some(
              (i: any) => i.dish_id === itemDishId
            );
            if (!exists) {
              comboObj.items.push({
                dish_id: itemDishId,
                dish_name: itemDishName || `ID:${itemDishId}`,
                dish_image: itemImage,
                // we may use more fields later if available
              });
            }
          });

          this.matchingCombos = Array.from(map.values());

          // If at least one combo is valid — prompt user
          if (this.matchingCombos.length > 0) {
            this.comboMessage =
              "Combo offer available. Do you want to choose a combo?";
            this.showComboAlert = true;
            // keep matchingCombos ready for modal
            console.log("matchingCombos", this.matchingCombos);
          } else {
            this.showComboAlert = false;
          }
        } else {
          // no combos
          this.matchingCombos = [];
          this.showComboAlert = false;
        }
      },
      (err: any) => {
        console.error("Failed to fetch combo details", err);
        this.matchingCombos = [];
        this.showComboAlert = false;
      }
    );
  }

  // user tapped YES on alert -> open selection modal
  onComboYes() {
    this.showComboAlert = false;
    // open combo selection (we use your existing combo-selection component which lists combos)
    this.showComboSelection = true;
  }

  // user tapped NO -> close alert
  onComboNo() {
    this.showComboAlert = false;
  }

  // combo-selection emitted a selected combo object
  onComboSelected(combo: any) {
    this.showComboSelection = false;
    if (!combo) return;

    // find dish ids used by this combo
    const comboDishIds: number[] = (combo.items || [])
      .map((i: any) => i.dish_id)
      .filter(Boolean);

    // Remove standard dishes used in this combo (so they don't appear duplicated)
    this.cartItems = this.cartItems.filter((item: any) => {
      // keep non-standard or standard dishes that are not part of comboDishIds
      if (item.dish_type !== "standard") return true;
      return !comboDishIds.includes(item.dish_id);
    });

    // Add one combo cart item
    const comboCartItem = {
      dish_id:
        combo.combo_id || combo.combo_id || combo.comboId || combo.dish_id,
      dish_name: combo.combo_name || combo.comboName || "Combo",
      dish_price: combo.combo_price || combo.comboPrice || 0,
      dish_quantity: 1,
      dish_type: "combo",
      combo_selected_dishes: [
        {
          combo_option_name: combo.combo_name || combo.comboName || "Combo",
          combo_option_dish_name: "", // optional, leave blank or set a group label
          combo_option_selected_array: combo.items.map((it: any) => ({
            dish_opt_type: it.dish_name || it.dish_name || `ID:${it.dish_id}`,
            choose_option: [
              {
                name: it.dish_name || `ID:${it.dish_id}`,
                price: 0,
                quantity: 1,
                dish_id: it.dish_id,
                image_url: it.dish_image || "",
              },
            ],
          })),
        },
      ],
      // preserve raw items for easier server payload
      combo_items: combo.items,
    };

    this.cartItems.push(comboCartItem);

    // refresh view data & detect changes
    this.totalCartDetails = this.apiService.transformData(this.cartItems);
    this.cartItems = [...this.cartItems];
    this.cdr.detectChanges();
  }

  /* ----------------------
     Misc UI handlers
     ---------------------- */

  onPopupClosed() {
    console.log("Popup closed — resetting edit mode");
    this.isEditing = false;
  }

  openComboSelectionModal() {
    this.showComboSelection = true;
  }

  editItem(item: any) {
    this.isEditing = true;
    if (this.mediaComponent) {
      this.mediaComponent.openEditPopup(item);
    }
  }

  clearOrderDetails() {
    this.cartItems = [];
    this.totalCartDetails = [];
  }

  orderList() {
    const modalRef = this.modal.open(PosOrdersComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "xl",
    });
  }

  /* ----------------------
     SUBMIT ORDER (build final reqbody)
     ---------------------- */

  submitOrder() {
    this.comboOrderDetails = [];

    this.modalRef = this.modalService.open(OrderPaymentsComponent, {
      size: "xl",
      centered: true,
    });
    this.modalRef.componentInstance.data = this.totalCartDetails;
    this.modalRef.componentInstance.customer = this.customer;

    this.modalRef.result.then(
      (result: any) => {
        if (!result) return;
        this.paymentdetails = result;

        // Build orderItemsDetails (flatten)
        this.orderItemsDetails = this.cartItems.map((item: any) => ({
          dish_id: item.dish_id,
          dish_note: item.dishnote,
          quantity: item.dish_quantity,
          price:
            item.duplicate_dish_price || this.apiService.getItemSubtotal(item),
        }));

        // Build combo_order_details explicitly from cart
        const combosForOrder = this.cartItems
          .filter((x: any) => x.dish_type === "combo")
          .map((combo: any) => ({
            combo_id: combo.dish_id,
            combo_name: combo.dish_name,
            combo_price: combo.dish_price,
            selected_groups:
              combo.combo_items || combo.combo_selected_dishes || [],
          }));

        this.comboOrderDetails = combosForOrder;

        // build toppings & ingredients (if exist)
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
          (dish.dish_ingredient_array || [])
            .filter((opt: any) => opt.selected)
            .map((opt: any) => ({
              dish_id: dish.dish_id,
              name: opt.name,
              price: opt.price,
              quantity: opt.quantity,
            }))
        );

        let user = JSON.parse(
          this.sessionStorageService.getsessionStorage("loginDetails") as any
        ).user;

        const reqbody: any = {
          total_price: this.subtotal,
          total_quantity: this.cartItems.length,
          store_id: user.store_id,
          order_type:
            this.orderForm.get("orderType")?.value === "pickup" ? 1 : 2,
          pickup_datetime: new Date(),
          delivery_address: this.orderForm.get("deliveryAddress")?.value,
          delivery_fees: this.deliveryfee,
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

        // Final submit to backend
        this.apiService
          .postApi("/api/order/v2 ", reqbody)
          .subscribe((res: any) => {
            if (res && res.code == 1) {
              this.toastr.success(res.message, "Success");
              this.cartItems = [];
              this.totalCartDetails = [];
              this.customer = { name: "", email: "", phone: "" };
              this.cdr.detectChanges();
            } else {
              this.toastr.error(res?.message || "Order failed", "Error");
            }
          });
      },
      (reason: any) => {
        console.log("Modal dismissed:", reason);
      }
    );
  }

  /* ----------------------
     Address autocomplete helpers (unchanged)
     ---------------------- */

  getAddressAutocomplete() {
    console.log("addressInput");
    const autocomplete = new google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      {
        componentRestrictions: { country: "nz" },
        fields: ["formatted_address", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        // this.addModelForm.patchValue({ address: place.formatted_address });
      }
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll(".pac-item span").forEach((el) => {
        if (el.textContent && el.textContent.includes(",")) {
          el.textContent = el.textContent.substring(
            0,
            el.textContent.lastIndexOf(",")
          );
        }
      });

      const pac = document.querySelector(".pac-container") as HTMLElement;
      if (pac) {
        pac.style.zIndex = "2000";
        pac.style.position = "absolute";
        pac.style.width = this.addressInput.nativeElement.offsetWidth + "px";
        const rect = this.addressInput.nativeElement.getBoundingClientRect();
        pac.style.top = rect.bottom + "px";
        pac.style.left = rect.left + "px";
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  ngAfterViewInit() {
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

    observer.observe(document.body, {
      childList: true,
      subtree: true,
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
      this.orderdueForm.value.orderDue == "ASAP"
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
}

// optional CartItem interface left as-is
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img?: string;
  Ingredients: string;
}
