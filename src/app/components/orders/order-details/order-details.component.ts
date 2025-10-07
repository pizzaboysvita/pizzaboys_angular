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
  constructor(private apiService: ApisService, private fb: FormBuilder, private el: ElementRef, private modal: NgbModal, private toastr: ToastrService, private cdr: ChangeDetectorRef, private sessionStorageService: SessionStorageService,private modalService: NgbModal) {
    this.markers = [];
    this.zoom = 3;
  }
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
      orderDateTime: ['', Validators.required]
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

  addToCart(item: any) {
    console.log(item,'>>>>>>>>>>>>>>> Add To cart')


    const existingItem = this.cartItems.find((cartItem: any) => cartItem.dish_id === item.dish_id);
    console.log(existingItem, 'existingItem')
    if (existingItem) {
      // If item already exists in the cart, just update the quantity
      existingItem.dish_quantity++;
    } else {
      // console.log(  this.moveSelectedOptionsToMainObject(item), 'moveSelectedOptionsToMainObject')
      this.cartItems.push({ ...item });
      // if(item.dish_type =='combo'){
  this.totalCartDetails=this.apiService.transformData(this.cartItems)
// }
      console.log(this.totalCartDetails, 'this.totalCartDetails')
      if (this.cartItems.length > 1) {
        this.cartItems.forEach((cartItem: any) => {
          if (cartItem.dish_type == 'standard') {
            this.comboDishDetails.forEach((comboItem: any) => {
              if (comboItem.combo_item_dish_id == cartItem.dish_id) {
                console.log(comboItem, 'comboItem')
                this.toastr.success(comboItem.dish_name + ' ' + comboItem.dish_price, 'Check Combo Options');
                // 
                // cartItem.dish_quantity = 1; // Initialize quantity for each item
              }
            });
          }
        })
      }
      // this.moveSelectedOptionsToMainObject(item);
    }
    console.log(this.cartItems, '  this.cartItems')
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


 
  showNewModelPopup = false;
  openNewModelPopup() {
    this.showNewModelPopup = true;
  }
  closeNewModelPopup() {
    this.showNewModelPopup = false;
  }
  submitOrder() {
      this.modalRef = this.modalService.open(OrderPaymentsComponent, {
               size: "xl",
               centered: true,
             });
             this.modalRef.componentInstance.data = this.totalCartDetails;
             
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
      "order_type": this.orderForm.get('orderType')?.value,
      "pickup_datetime": new Date(),
      "delivery_address": this.orderForm.get('deliveryAddress')?.value,
      "delivery_fees": this.deliveryfee,
      is_pos_order: 1,
      "delivery_datetime": new Date(),
      "order_notes": this.orderForm.get('deliveryNote')?.value,
      "order_status": "Confirmed",
      "order_created_by": user.store_id,
      "order_details_json": this.orderItemsDetails,
      "payment_method": "Card",
      "payment_status": "Completed",
      "payment_amount": this.total,
      "order_due": this.orderdueForm.get('orderDue')?.value,
      "order_due_datetime": this.orderdueForm.get('orderDateTime')?.value,
      "topping_details": this.toppingDetails,
      ingredients_details: this.ingredients_details,
      unitnumber: this.orderForm.value.unitNumber,
      delivery_notes: this.orderForm.value.deliveryNote,
      "gst_price": this.tax,
      combo_order_details:this.totalCartDetails,
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
}
export interface CartItem {
  name: string;      // Item name
  price: number;     // Item price
  quantity: number;  // Quantity of the item
  img?: string;      // Optional property for image URL
  Ingredients: string; //optional property for Ingredients

}