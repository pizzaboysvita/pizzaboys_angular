import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DetailsComponent } from "./details/details.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { MediaComponent } from '../../media/media.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApisService } from '../../../shared/services/apis.service';

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

  constructor(private apiService:ApisService, private cdr: ChangeDetectorRef) {
    this.markers = [];
    this.zoom = 3;
  }
  filterOptions = ['Cash', 'Card', 'E-Wallet'];
  selectedOption = 'Cash';
  
  selectOption(option: string) {
    this.selectedOption = option;
  }
  
  ngOnInit() {
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
  }
  cartItems:any= [];


  @ViewChild(GoogleMap) map!: GoogleMap;
//  cartItems = [
//     { name: 'Chicken Tacos', price: 20.36, quantity: 2, img: '/assets/food/chicken-tacos.jpg' },
//     { name: 'Pizza', price: 25.36, quantity: 4,  img: '/assets/food/default-pizza.avif' },
//     { name: 'Italian Pasta', price: 18.30, quantity: 1, img: '/assets/food/italian-pasta.jpg' },
//     { name: 'Beetroot', price: 30.36, quantity: 2, img: '/assets/food/beetroot_juice.avif' },
//     { name: 'Salad', price: 80.36, quantity: 2,  img: '/assets/food/salads.png' },
    
//   ];
  addToCart(item: any) {
    console.log(item)
    const existingItem = this.cartItems.find((cartItem:any) => cartItem.dish_id === item.dish_id);
  
    if (existingItem) {
      // If item already exists in the cart, just update the quantity
      existingItem.quantity++;
    } else {

      this.cartItems.push({ ...item });
      console.log( this.cartItems)
      this.totalPrice =  this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0)
  console.log( this.cartItems)

console.log(this.totalPrice,'oppppppppppp')
    }
     console.log(  this.cartItems,'  this.cartItems')
  }
  decreaseFromCart(item: CartItem) {
  const existingItem = this.cartItems.find((cartItem:any) => cartItem.name === item.name);

  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity--;
    } else {
      // Remove from cart if quantity is 0 or 1
      this.cartItems = this.cartItems.filter((cartItem:any) => cartItem.name !== item.name);
    }
  }
}
 
get subtotal(): number {
  console.log(this.cartItems,'<<<<<<<<<<<------------------this.cartItems.')
  return this.cartItems.reduce((sum:any, item:any) => sum + item.subtotal , 0);
}

get tax(): number {
  return +(this.subtotal * 0.10).toFixed(2); // 10% Tax
}

// get total(): number {
//   return +(this.subtotal + this.tax).toFixed(2);
// }
  get total() {
    return this.cartItems.reduce((sum:any, item:any) => sum + (item.dish_price * item.quantity), 0);
    // return this.subtotal + this.tax - this.discount;
  }



  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter((i:any) => i !== item);
     this.totalPrice =  this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0)
  console.log( this.cartItems)
  }



  
  updateItem(action: 'increase' | 'decrease' | 'option', item: any, option?: any) {

    console.log(action,item,option,'>>>>>>>>>>>>>>>>>>>step 1')
  // For quantity
  if (action === 'increase') {
    item.quantity++;
  }

  if (action === 'decrease') {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  // For option (ingredient) toggle
  if (action === 'option' && option) {
    option.selected = !option.selected;
  }

  // Update total after any change
  this.calculateTotal();
}
calculateTotal() {
   this.totalPrice = this.cartItems
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0);
//   this.cartItems.forEach((item:any)=>{
// // console.log(this.apiService.getItemSubtotal(item))
// item.subtotal= this.totalPrice 
//   })
     // this.loadItemsBySelectedTitle();
        this.cdr.detectChanges();
  
//   this.totalPrice = this.cartItems
//     .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0);
//    this.cartItems.forEach((item:any)=>{
// item.subtotal=this.totalPrice
//    })
   console.log(  this.totalPrice,'<-------------------------this.getItemSubtotal(item)--------')
}
}
export interface CartItem {
  name: string;      // Item name
  price: number;     // Item price
  quantity: number;  // Quantity of the item
  img?: string;      // Optional property for image URL
  Ingredients:string; //optional property for Ingredients

}