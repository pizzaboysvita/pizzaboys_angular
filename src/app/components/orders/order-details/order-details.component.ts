import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DetailsComponent } from "./details/details.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { MediaComponent } from '../../media/media.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.scss',
    imports: [NgbNavModule,MediaComponent,
         GoogleMapsModule,CommonModule]
})

export class OrderDetailsComponent {
  selected: string = 'dinein';
  public active = 1;
  public markers: any[];
  public zoom: number;

  constructor() {
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
  cartItems: CartItem[] = [];


  @ViewChild(GoogleMap) map!: GoogleMap;
//  cartItems = [
//     { name: 'Chicken Tacos', price: 20.36, quantity: 2, img: '/assets/food/chicken-tacos.jpg' },
//     { name: 'Pizza', price: 25.36, quantity: 4,  img: '/assets/food/default-pizza.avif' },
//     { name: 'Italian Pasta', price: 18.30, quantity: 1, img: '/assets/food/italian-pasta.jpg' },
//     { name: 'Beetroot', price: 30.36, quantity: 2, img: '/assets/food/beetroot_juice.avif' },
//     { name: 'Salad', price: 80.36, quantity: 2,  img: '/assets/food/salads.png' },
    
//   ];
  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find(cartItem => cartItem.name === item.name);
  
    if (existingItem) {
      // If item already exists in the cart, just update the quantity
      existingItem.quantity++;
    } else {
      // If item doesn't exist, add a new item to the cart
      this.cartItems.push({ ...item, quantity: 1 });
    }
  }
  decreaseFromCart(item: CartItem) {
  const existingItem = this.cartItems.find(cartItem => cartItem.name === item.name);

  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity--;
    } else {
      // Remove from cart if quantity is 0 or 1
      this.cartItems = this.cartItems.filter(cartItem => cartItem.name !== item.name);
    }
  }
}
  // get subtotal() {
  //   return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // }

  // get tax() {
  //   return this.subtotal * 0.10;  // 10% tax
  // }

  // get discount() {
  //   return this.subtotal * 0.20;  // 20% discount
  // }
get subtotal(): number {
  return this.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

get tax(): number {
  return +(this.subtotal * 0.10).toFixed(2); // 10% Tax
}

// get total(): number {
//   return +(this.subtotal + this.tax).toFixed(2);
// }
  get total() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // return this.subtotal + this.tax - this.discount;
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }
}
export interface CartItem {
  name: string;      // Item name
  price: number;     // Item price
  quantity: number;  // Quantity of the item
  img?: string;      // Optional property for image URL
  Ingredients:string; //optional property for Ingredients

}