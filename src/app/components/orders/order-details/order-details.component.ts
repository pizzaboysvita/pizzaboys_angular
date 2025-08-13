import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DetailsComponent } from "./details/details.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { MediaComponent } from '../../media/media.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { ToastrService } from 'ngx-toastr';
import { PosOrdersComponent } from '../pos-orders/pos-orders.component';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.scss',
    imports: [NgbNavModule,MediaComponent,FormsModule,
         GoogleMapsModule,CommonModule]
})

export class OrderDetailsComponent {
  selected: string = 'dinein';
  public active = 1;
  public markers: any[];
  public zoom: number;
  totalPrice: any =0;
  comboDishDetails: any;
  orderDeatils: any;
  orderItemsDeatils: any;
  orderItemsDetails: any;

  constructor(private apiService:ApisService, private modal: NgbModal, private toastr: ToastrService,private cdr: ChangeDetectorRef,private sessionStorageService:SessionStorageService) {
    this.markers = [];
    this.zoom = 3;
  }
  filterOptions = ['Cash', 'Card', 'E-Wallet'];
  selectedOption = 'Cash';
  
  selectOption(option: string) {
    this.selectedOption = option;
  }
  
  ngOnInit() {
     const userId = JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user.user_id;
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
      this.apiService.getApi('/api/dish?user_id=' + userId + '&typeOfDish=combo').subscribe(
      (res: any) => {
        this.comboDishDetails = res.data;
        console.log(this.comboDishDetails, 'comboDishDetails')
      }
    );
  }
  cartItems:any= [];


  @ViewChild(GoogleMap) map!: GoogleMap;

  addToCart(item: any) {
    console.log(item)
    const existingItem = this.cartItems.find((cartItem:any) => cartItem.dish_id === item.dish_id);
  console.log(existingItem, 'existingItem')
    if (existingItem) {
      // If item already exists in the cart, just update the quantity
      existingItem.dish_quantity++;
    } else {
// console.log(  this.moveSelectedOptionsToMainObject(item), 'moveSelectedOptionsToMainObject')
      this.cartItems.push({ ...item });
      console.log(this.cartItems,this.comboDishDetails ,'this.comboDishDetails')
      if(this.cartItems.length >1){
      this.cartItems.forEach((cartItem:any) => {
        if(cartItem.dish_type =='standard'){
          this.comboDishDetails.forEach((comboItem:any) => {
            if(comboItem.combo_item_dish_id == cartItem.dish_id){
              console.log(comboItem, 'comboItem')
                this.toastr.success(comboItem.dish_name +' ' +comboItem.dish_price, 'Check Combo Options');
              // 
              // cartItem.dish_quantity = 1; // Initialize quantity for each item
            }
          });
        }
        })
      }
  // this.moveSelectedOptionsToMainObject(item);
    }
     console.log(  this.cartItems,'  this.cartItems')
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
  console.log(this.cartItems,'<<<<<<<<<<<------------------this.cartItems.')
   return this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.orderItemSubtotal(item), 0)
}

get tax(): number {
 
  return +(this.subtotal * 0.10).toFixed(2); // 10% Tax
}


  get total() {
    console.log(this.cartItems,'<<<<<<<<<<<------------------this.cartItems. 345')
    return this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0)- this.tax;
    // return this.subtotal + this.tax - this.discount;
  }



  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter((i:any) => i !== item);
     this.totalPrice =  this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0)
  console.log( this.cartItems)
  }


  orderList() {
    const modalRef = this.modal.open(PosOrdersComponent, {
      windowClass: 'theme-modal',
      centered: true,
      size: 'xl'
    });
  }
submitOrder(){
 this.orderItemsDetails = this.cartItems.map((item: any) => ({
  dish_id: item.dish_id,
  quantity: item.dish_quantity,
  price: item.duplicate_dish_price
}));
  let user=JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user
  console.log(JSON.parse(
      this.sessionStorageService.getsessionStorage("loginDetails") as any
    ).user.user_id
,'new----------> 123',this.orderItemsDeatils)
  const reqbody={
    "total_price": this.subtotal,
    "total_quantity": this.cartItems.length,
    "store_id": user.store_id,
    "order_type": 1,
    "pickup_datetime": new Date(),
    "delivery_address": null,
    "delivery_fees": 0.00,
    "delivery_datetime": null,
    "order_notes": "Please prepare without spice",
    "order_status": 1,
    "order_created_by": user.store_id,
    "order_details_json": this.orderItemsDetails,
    "payment_method": "Card",
    "payment_status": "Completed",
    "payment_amount": this.total,
  }
  console.log(reqbody,'new----------> 123')
  this.apiService.postApi('/api/order', reqbody).subscribe((res:any)=>{
    console.log(res,'new----------> 123')
    if(res && res.code == 1){
      this.toastr.success(res.message, 'Success');
      this.cartItems = [];
    }
  })
}
  

}
export interface CartItem {
  name: string;      // Item name
  price: number;     // Item price
  quantity: number;  // Quantity of the item
  img?: string;      // Optional property for image URL
  Ingredients:string; //optional property for Ingredients

}