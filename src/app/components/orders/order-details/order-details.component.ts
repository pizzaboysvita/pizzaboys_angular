import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DetailsComponent } from "./details/details.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { MediaComponent } from '../../media/media.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { ToastrService } from 'ngx-toastr';
import { PosOrdersComponent } from '../pos-orders/pos-orders.component';
import { OrderPaymentsComponent } from '../order-payments/order-payments.component';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// import { DpDatePickerModule } from 'ng2-date-picker';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  imports: [NgbNavModule, MediaComponent, FormsModule, ReactiveFormsModule,

    GoogleMapsModule, CommonModule]
})

export class OrderDetailsComponent {

  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  // @ViewChild('modalBody', { static: false }) modalBody!: ElementRef;
  selectedDate!: Date;
  selectedTime!: Date;
  selected: string = 'dinein';
  public active = 1;
  public markers: any[];
  public zoom: number;
  totalPrice: any = 0;
  comboDishDetails: any;
  orderDeatils: any;
  orderItemsDeatils: any;
  orderItemsDetails: any;
  orderForm: FormGroup
  orderdueForm: FormGroup
  showOrderDuePopup: boolean = false;
  orderDueDetails: any;
  toppingDetails: any;
  ingredients_details: any;
  deliveryfee: any = 5.90;
  totalCartDetails: any=[];
  modalRef: any;
  paymentdetails: any;
  comboOrderDetails: any[] = [];
  showCustomerModal: boolean;
  selectedItemForEdit: any;
  selectedDishFromList: any;
  showPopup: boolean;
  isEditing: boolean;
  constructor(private apiService: ApisService, private fb: FormBuilder, private el: ElementRef, private modal: NgbModal, private toastr: ToastrService, private cdr: ChangeDetectorRef, private sessionStorageService: SessionStorageService,private modalService: NgbModal) {
    this.markers = [];
    this.zoom = 3;
  }
    customer = {
    name: '',
    email: '',
    phone: ''
  };
  filterOptions = ['Cash', 'Card', 'E-Wallet'];
  selectedOption = 'Cash';

  selectOption(option: string) {
    this.selectedOption = option;
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderType: ['pickup', Validators.required],
      deliveryAddress: [''],
      streetNumber: [''],
      streetName: [''],
      unitNumber: [''],
      deliveryNote: [''],

    });
    this.orderdueForm = this.fb.group({
      orderDue: ['ASAP', Validators.required],
      orderDateTime: [new Date(), Validators.required]
    });
    this.orderDueDetails = this.orderdueForm.value.orderDue;
    const userId = JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.store_id;

    this.markers.push({
      position: {
        lat: 20.5937,
        lng: 78.9629
      },
      label: {
        color: "black",
        text: "India"
      },
      Option: {
        draggable: true,
        animation: google.maps.Animation.DROP,
      },
    });
    this.apiService.getApi('/api/dish?store_id=' + userId + '&typeOfDish=combo').subscribe(
      (res: any) => {
        this.comboDishDetails = res.data;
        console.log(this.comboDishDetails, 'comboDishDetails')
      }
    );
  }
  cartItems: any = [];


  @ViewChild(GoogleMap) map!: GoogleMap;

//   addToCart(item: any) {
//     console.log(item,'>>>>>>>>>>>>>>> Add To cart')

//     const existingItem = this.cartItems.find((cartItem: any) => cartItem.dish_id === item.dish_id);
//     console.log(existingItem, 'existingItem')
//     if (existingItem) {
//       // If item already exists in the cart, just update the quantity
//       existingItem.dish_quantity++;
//     } else {
//       // console.log(  this.moveSelectedOptionsToMainObject(item), 'moveSelectedOptionsToMainObject')
//       this.cartItems.push({ ...item });
//       // if(item.dish_type =='combo'){
//   this.totalCartDetails=this.apiService.transformData(this.cartItems)
// // }
//       console.log(this.totalCartDetails, 'this.totalCartDetails')
//       if (this.cartItems.length > 1) {
//         this.cartItems.forEach((cartItem: any) => {
//           if (cartItem.dish_type == 'standard') {
//             this.comboDishDetails.forEach((comboItem: any) => {
//               if (comboItem.combo_item_dish_id == cartItem.dish_id) {
//                 console.log(comboItem, 'comboItem')
//                 this.toastr.success(comboItem.dish_name + ' ' + comboItem.dish_price, 'Check Combo Options');
//                 // 
//                 // cartItem.dish_quantity = 1; // Initialize quantity for each item
//               }
//             });
//           }
//         })
//       }
//       // this.moveSelectedOptionsToMainObject(item);
//     }
//     console.log(this.cartItems, '  this.cartItems')
//   }
// addToCart(item: any) {
//   console.log(item, '>>>>>>>>>>>>>>> Add To cart');

//   const existingIndex = this.cartItems.findIndex(
//     (cartItem: any) => cartItem.dish_id === item.dish_id
//   );

//   if (existingIndex > -1) {
//     // ✅ Item already exists in cart

//     // ✅ If editing, reflect changes (no duplicate)
//     if (this.isEditing) {
//     const existingItem = this.cartItems[existingIndex];

//       console.log('🟢 Updating existing item with edited details...');
//       this.cartItems[existingIndex] = {
//         ...existingItem,
//         ...item, // merge all latest edits
//         dish_option_set_array: [...(item.dish_option_set_array || [])],
//         dish_ingredient_array: [...(item.dish_ingredient_array || [])],
//       };
//     } else {
//           const existingItem = this.cartItems[existingIndex];
//       // ✅ If not editing, just increase quantity
//       existingItem.dish_quantity++;
//     }
//   } else {
//     // ✅ If it’s a new item, push to cart
//     this.cartItems.push({ ...item });
//   }

//   // ✅ Always recalc total and refresh references
//   this.totalCartDetails = this.apiService.transformData(this.cartItems);

//   // ✅ Combo check logic (unchanged)
//   if (this.cartItems.length > 1) {
//     this.cartItems.forEach((cartItem: any) => {
//       if (cartItem.dish_type === 'standard') {
//         this.comboDishDetails.forEach((comboItem: any) => {
//           if (comboItem.combo_item_dish_id === cartItem.dish_id) {
//             console.log(comboItem, 'comboItem');
//             this.toastr.success(
//               `${comboItem.dish_name} ${comboItem.dish_price}`,
//               'Check Combo Options'
//             );
//           }
//         });
//       }
//     });
//   }

//   // ✅ Trigger change detection
//   this.cartItems = [...this.cartItems];
   
//   this.cdr.detectChanges();

//   console.log(this.cartItems, 'Updated cartItems after add/edit');
// }
addToCart(item: any) {
  console.log(item, '>>>>>>>>>>>>>>> Add To cart');

  const existingIndex = this.cartItems.findIndex(
    (cartItem: any) => cartItem.dish_id === item.dish_id
  );

  const existingItem = existingIndex > -1 ? this.cartItems[existingIndex] : null;

  // ✏️ CASE 1: If editing and item exists → Update it
  if (this.isEditing && existingItem) {
    console.log("🟢 Editing mode — updating existing item...");
    this.cartItems[existingIndex] = {
      ...existingItem,
      ...item, // Merge all updated fields
      dish_option_set_array: [...(item.dish_option_set_array || [])],
      dish_ingredient_array: [...(item.dish_ingredient_array || [])],
    };
    this.isEditing=false
  }

  // 🆕 CASE 2: If NOT editing and item does NOT exist → Add new
  else if (!this.isEditing && !existingItem) {
    console.log("🆕 Adding new item to cart...");
    this.cartItems.push({ ...item });
  }

  // 🚫 CASE 3: If NOT editing and item already exists → Skip (do nothing)
  else if (!this.isEditing && existingItem) {
    console.log("🚫 Item already exists in cart — skipping add.");
    // No changes
    return;
  }

  // ✅ Recalculate totals
  this.totalCartDetails = this.apiService.transformData(this.cartItems);

  // ✅ Combo check logic (unchanged)
  if (this.cartItems.length > 1) {
    this.cartItems.forEach((cartItem: any) => {
      if (cartItem.dish_type === 'standard') {
        this.comboDishDetails.forEach((comboItem: any) => {
          if (comboItem.combo_item_dish_id === cartItem.dish_id) {
            console.log(comboItem, 'comboItem');
            this.toastr.success(
              `${comboItem.dish_name} ${comboItem.dish_price}`,
              'Check Combo Options'
            );
          }
        });
      }
    });
  }

  // ✅ Trigger change detection
  this.cartItems = [...this.cartItems];
  this.cdr.detectChanges();

  console.log(this.cartItems, '🧾 Updated cartItems after add/edit');
}


  increaseModalQuantity(item: any) {
    console.log(item, 'increaseModalQuantity')
    item['dish_quantity']++;

  }
  decreaseModalQuantity(item: any) {
    if (item['dish_quantity'] > 1) {
      item['dish_quantity']--;

    }
  }

  get subtotal(): number {
    // console.log(this.totalCartDetails,'<<<<<<<<<<<------------------this.cartItems.')

    return   this.totalCartDetails
      .reduce((sum: any, item: any) => sum + this.apiService.getItemSubtotal(item), 0)
  }

  get tax(): number {

    return +(this.subtotal * 0.10).toFixed(2); // 10% Tax
  }


  get total() {
    const fee = this.orderForm.value.orderType == 'delivery' ? this.deliveryfee : 0
    // console.log(this.cartItems,this.totalCartDetails ,'<<<<<<<<<<<------------------this.cartItems. 345')
    return this.totalCartDetails
      .reduce((sum: any, item: any) => sum + this.apiService.getItemSubtotal(item), 0) + this.tax + fee;
    // return this.subtotal + this.tax - this.discount;
  }



  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter((i: any) => i !== item);
    this.totalPrice = this.cartItems
      .reduce((sum: any, item: any) => sum + this.apiService.getItemSubtotal(item), 0)
    console.log(this.cartItems)
  }

removeItems(item: any) {
  // Remove the item from cartItems
  this.cartItems = this.cartItems.filter((cartItem: { dish_id: any; }) => cartItem.dish_id !== item.dish_id);

  // Recalculate each item's duplicate_dish_price
  this.cartItems.forEach((cartItem: { duplicate_dish_price: number; }) => {
    cartItem.duplicate_dish_price = this.apiService.getItemSubtotal(cartItem);
  });

  // Update total price
  this.totalPrice = this.cartItems.reduce(
    (sum: any, cartItem: { duplicate_dish_price: any; }) => sum + cartItem.duplicate_dish_price,
    0
  );

  // Update cart reference if needed
  this.totalCartDetails = [...this.cartItems];

  // Trigger Angular change detection
  this.cdr.detectChanges();

  console.log(this.cartItems, 'Updated cartItems after removal');
}

 
  showNewModelPopup = false;
  openNewModelPopup() {
    this.showNewModelPopup = true;
  }
  closeNewModelPopup() {
    this.showNewModelPopup = false;
  }
  submitOrder() {
   this.comboOrderDetails=[]
      this.modalRef = this.modalService.open(OrderPaymentsComponent, {
               size: "xl",
               centered: true,
             });
             this.modalRef.componentInstance.data = this.totalCartDetails;
             this.modalRef.componentInstance.customer = this.customer;
             
            this.modalRef.result.then(
    (result: { updatedCart: any; }) => {
      if (result) {
        console.log('Modal closed with data:', result);
        // Do something with the returned data
       this.paymentdetails = result;
        console.log(this.paymentdetails);
        console.log(this.cartItems, 'this.cartItems opennnnnnnnnnnn ')
        
    this.orderItemsDetails = this.cartItems.map((item: any) => ({
      dish_id: item.dish_id,
      dish_note: item.dishnote,
      quantity: item.dish_quantity,
      price: item.duplicate_dish_price,
      // base:item.selectedOptions.name,
      // base_price:item.selectedOptions.price
  

    }));

this.cartItems.forEach((dish: any) => {
  // Parse if JSON string
  let choices = [];
  if (typeof dish.dish_choices_json === 'string') {
    try {
      choices = JSON.parse(dish.dish_choices_json);
    } catch (e) {
      console.error('Invalid JSON in dish_choices_json:', dish.dish_choices_json);
      choices = [];
    }
  } else if (Array.isArray(dish.dish_choices_json)) {
    choices = dish.dish_choices_json;
  }

  // Now push combo details
  choices.forEach((opt: any) => {
    if(this.comboOrderDetails.filter(x=>(x.combo_id!=dish.dish_id  && x.combo_name!=dish.dish_name && x.price!=dish.duplicate_dish_price ))){
      this.comboOrderDetails.push({
        combo_id: dish.dish_id,
        combo_name: dish.dish_name,
        price: dish.duplicate_dish_price
      });
    }
  });
});

    console.log(this.comboOrderDetails);
    this.toppingDetails = this.cartItems.flatMap((dish: any) =>
      dish.selectedOptions
        .filter((opt: any) => opt.selected)
        .map((opt: any) => ({
          dish_id: dish.dish_id,
          // inventory_id
          name: opt.name,
          price: opt.price,
          quantity: opt.quantity
        }))
    );
    this.ingredients_details = this.cartItems.flatMap((dish: any) =>
      dish.dish_ingredient_array
        .filter((opt: any) => opt.selected)
        .map((opt: any) => ({
          dish_id: dish.dish_id,
          name: opt.name,
          price: opt.price,
          quantity: opt.quantity
          // inventory_id
        }))
    );
    console.log(this.toppingDetails, 'this.cartItems opennnnnnnnnnnn ')
    let user = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user
    console.log(JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user.user_id
      , 'new----------> 123', this.orderItemsDeatils)
    const reqbody = {
      "total_price": this.subtotal,
      "total_quantity": this.cartItems.length,
      "store_id": user.store_id,
      // "order_type": this.orderForm.get('orderType')?.value,
      "order_type": this.orderForm.get('orderType')?.value === 'pickup' ? 1 : 2,
      "pickup_datetime": new Date(),
      "delivery_address": this.orderForm.get('deliveryAddress')?.value,
      "delivery_fees": this.deliveryfee,
      is_pos_order: 1,
      "delivery_datetime": new Date(),
      "order_notes": this.orderForm.get('deliveryNote')?.value,
      "order_status": "Confirmed",
      "order_created_by": user.store_id,
      "order_details_json": this.orderItemsDetails,
      // "payment_method": "Card",
      // "payment_status": "Completed",
      // "payment_amount": this.total,
      "order_due": this.orderdueForm.get('orderDue')?.value,
      "order_due_datetime": this.orderdueForm.get('orderDateTime')?.value,
      "topping_details": this.toppingDetails,
      ingredients_details: this.ingredients_details,
      unitnumber: this.orderForm.value.unitNumber,
      delivery_notes: this.orderForm.value.deliveryNote,
      "gst_price": this.tax,
      combo_order_details:this.comboOrderDetails,
      order_payments_json:this.paymentdetails.order_payments_json,
      payment_split_percentage_json:this.paymentdetails.payment_split_percentage_json, 
      payment_split_users_json:this.paymentdetails.payment_split_users_json,
      payment_split_items_json:this.paymentdetails.payment_split_items_json
    }
    console.log(reqbody, 'new----------> 123')
    // /api/order
    this.apiService.postApi('/api/order/v2 ', reqbody).subscribe((res: any) => {
      console.log(res, 'new----------> 123')
      if (res && res.code == 1) {
        this.toastr.success(res.message, 'Success');
        this.cartItems = [];
        this.totalCartDetails=[]
      }
    })
        
      }
    },
    (reason: any) => {
      console.log('Modal dismissed:', reason);
    }
  );
    
  }
  getAddressAutocomplete() {
    console.log('addressInput')
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
      componentRestrictions: { country: 'nz' },
      fields: ['formatted_address', 'geometry']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        // this.addModelForm.patchValue({ address: place.formatted_address });
      }
    });

    // Watch for pac-container and force re-position
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.pac-item span').forEach((el) => {
        if (el.textContent && el.textContent.includes(',')) {
          // Remove everything after the last comma
          el.textContent = el.textContent.substring(0, el.textContent.lastIndexOf(','));
        }
      });

      const pac = document.querySelector('.pac-container') as HTMLElement;
      if (pac) {
        pac.style.zIndex = '2000';
        pac.style.position = 'absolute';
        pac.style.width = this.addressInput.nativeElement.offsetWidth + 'px';
        const rect = this.addressInput.nativeElement.getBoundingClientRect();
        pac.style.top = rect.bottom + 'px';
        pac.style.left = rect.left + 'px';
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
  ngAfterViewInit() {

    const observer = new MutationObserver(() => {
      const pac = document.querySelector('.pac-container') as HTMLElement;
      if (pac && this.addressInput) {
        const rect = this.addressInput.nativeElement.getBoundingClientRect();

        pac.style.zIndex = '2000'; // above modal
        pac.style.position = 'fixed'; // use fixed for modal positioning
        pac.style.width = rect.width + 'px';
        pac.style.top = rect.bottom + 'px';
        pac.style.left = rect.left + 'px';
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
    this.orderDueDetails = this.orderdueForm.value.orderDue == 'ASAP' ? this.orderdueForm.value.orderDue : this.orderdueForm.value.orderDateTime;
    this.showOrderDuePopup = false
    this.showNewModelPopup=false
  }
  closeCustomerModal(){
  this.showCustomerModal=false
}
  openCustomerModal(){
   this.customer = {
    name: '',
    email: '',
    phone: ''
  };
  this.showCustomerModal=true
}
clear(){
  this.customer = {
    name: '',
    email: '',
    phone: ''
  };
}
 @ViewChild(MediaComponent) mediaComponent!: MediaComponent;

  editItem(item: any) {
    this.isEditing=true
    if (this.mediaComponent) {
      this.mediaComponent.openEditPopup(item); // ✅ call popup method from media
    }
  }

}

export interface CartItem {
  name: string;      // Item name
  price: number;     // Item price
  quantity: number;  // Quantity of the item
  img?: string;      // Optional property for image URL
  Ingredients: string; //optional property for Ingredients

}