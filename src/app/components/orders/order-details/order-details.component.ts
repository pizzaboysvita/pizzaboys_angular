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
    .reduce((sum :any, item :any) => sum + this.apiService.getItemSubtotal(item), 0)
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



  

}
export interface CartItem {
  name: string;      // Item name
  price: number;     // Item price
  quantity: number;  // Quantity of the item
  img?: string;      // Optional property for image URL
  Ingredients:string; //optional property for Ingredients

}