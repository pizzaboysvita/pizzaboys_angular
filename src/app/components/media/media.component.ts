import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../shared/components/card/card.component";
import { MediaLibrary, media } from '../../shared/data/media';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';
import { AddMediaComponent } from './add-media/add-media.component';
import { OrderDetailsComponent } from '../orders/order-details/order-details.component';
import { CommonService } from '../../shared/services/common.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss',
    imports: [CardComponent]
})

export class MediaComponent{
  @Output() itemAdded = new EventEmitter<CartItem>();
  // items = [
  //   { name: 'Pizza', img: '/assets/food/pizza.jpeg' },
  //   { name: 'Pasta', img: '/assets/food/pasta.png' },
  //   { name: 'Burger', img: '/assets/food/burger-icon.avif' },
  //   { name: 'Fries', img: '/assets/food/pasta.png' },
  //   { name: 'Salad', img: '/assets/food/salads.png' },
  // ];

  itemsList:CartItem[] = [];
  // items:CartItem[] = [];
  items = [
    { name: 'Chicken Tacos', price: 20.36, quantity: 1, img: '/assets/food/chicken-tacos.jpg', Ingredients: '', title: 'Classic Range Pizzas' },
    { name: 'Pizza', price: 25.36, quantity: 1, img: '/assets/food/default-pizza.avif', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas' },
    { name: 'Italian Pasta', price: 18.30, quantity: 1, img: '/assets/food/italian-pasta.jpg', Ingredients: 'wheat flour or semolina, eggs (sometimes), and sometimes olive oil. Other ingredients, like tomatoes, garlic, herbs (basil, oregano), and cheese,', title: 'Classic Range Pizzas' },
    { name: 'Beetroot', price: 30.36, quantity: 1, img: '/assets/food/beetroot_juice.avif', Ingredients: '', title: 'Non Vegetarian' },
    { name: 'Salad', price: 80.36, quantity: 1, img: '/assets/food/salads.png', Ingredients: '', title: 'Non Vegetarian' },
  ];
  selectedItem: any = null;
  showPopup: boolean = false;
  public MediaLibrary = MediaLibrary;
  public url: string[];
   selectedTitle1:any = '';
  constructor(public modal: NgbModal,private commonService:SessionStorageService,private cdr: ChangeDetectorRef) { 
 
  }

  ngOnInit() {

   this.loadItemsBySelectedTitle();
  }


  loadItemsBySelectedTitle() {
    this.commonService.selectedMenuTitle$.subscribe(title => {
      this.selectedTitle1 = title;
      this.itemsList = this.items.filter(item => item.title.trim() === title.trim());
    });
  
    // In case page refresh
    const savedTitle = this.commonService.getSelectedMenuTitle();
    if (savedTitle) {
      this.selectedTitle1 = savedTitle;
      this.itemsList = this.items.filter(item => item.title.trim() === savedTitle.trim());
    }
  
  }
  
  
 
  open(data: media) {
    this.MediaLibrary.forEach(item => {
      if (data.id === item.id) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
    });
  }

  addMedia() {
    this.modal.open(AddMediaComponent, { windowClass: 'media-modal theme-modal', size: 'xl' })
  }
  addItem(item: CartItem) {
    
    this.itemAdded.emit(item);  // Emit the selected item
  }

  openIngredientsPopup(item: any) {
    this.selectedItem = item;
    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }
  
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img?: string;
  Ingredients:string;
  title:string
}


