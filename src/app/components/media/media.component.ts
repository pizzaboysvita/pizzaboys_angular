import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../shared/components/card/card.component";
import { MediaLibrary, media } from '../../shared/data/media';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';
import { AddMediaComponent } from './add-media/add-media.component';
import { OrderDetailsComponent } from '../orders/order-details/order-details.component';
import { CommonService } from '../../shared/services/common.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { FeatherIconsComponent } from "../../shared/components/feather-icons/feather-icons.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss',
    imports: [CardComponent, FeatherIconsComponent,CommonModule,FormsModule]
})

export class MediaComponent{
  public searchText: string = '';
  public isSearch: boolean = false;
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  // selectedItem: any = null;
  showPopup: boolean = false;
  public MediaLibrary = MediaLibrary;
  public url: string[];
  selectedTitle1:any = '';
  quantity=1;
  expandedIndex: any;
  @Output() itemAdded = new EventEmitter<CartItem>();
  itemsList:CartItem[] = [];
  items = [
    { name: 'Chicken Tacos', price: 20.36, quantity: 1, img: '/assets/food/chicken-tacos.jpg', Ingredients: '', title: 'Non Vegetarian' },
    { name: 'Chicken Tacos', price: 20.36, quantity: 1, img: '/assets/food/chicken-Roll.jpg', Ingredients: '', title: 'Non Vegetarian' },
    { name: 'Chicken Tacos', price: 20.36, quantity: 1, img: '/assets/food/chicken-cutlet.jpg', Ingredients: '', title: 'Non Vegetarian' },
    { name: 'Italian Pasta', price: 18.30, quantity: 1, img: '/assets/food/italian-pasta.jpg', Ingredients: 'wheat flour or semolina, eggs (sometimes), and sometimes olive oil. Other ingredients, like tomatoes, garlic, herbs (basil, oregano), and cheese,', title: 'Pasta' },
    { name: 'Beetroot', price: 30.36, quantity: 1, img: '/assets/food/beetroot_juice.avif', Ingredients: '', title: 'Drinks' },
    { name: 'Salad', price: 80.36, quantity: 1, img: '/assets/food/salads.png', Ingredients: '', title: 'Non Vegetarian' },
    { name: 'Soft Drinks', price: 30.36, quantity: 1, img: '/assets/food/cool-drinks.jpg', Ingredients: '', title: 'Drinks' },
    { name: 'Juice', price: 80.36, quantity: 1, img: '/assets/food/cool-drinks3.jpg', Ingredients: '', title: 'Drinks' },
    { name: 'Juice', price: 80.36, quantity: 1, img: '/assets/food/cool-drinks2.jpeg', Ingredients: '', title: 'Drinks' },
    { name: 'Pasta Spaghetti', price: 30.36, quantity: 1, img: '/assets/food/pasta-img.avif', Ingredients: '', title: 'Pasta' },
    { name: 'panne Pasta Stock', price: 80.36, quantity: 1, img: '/assets/food/istock-Pasta.jpg', Ingredients: '', title: 'Pasta' },
    { name: 'Spicy Penne Pasta', price: 80.36, quantity: 1, img: '/assets/food/Spicy-Penne-Pasta.png', Ingredients: '', title: 'Pasta' },
    { name: 'Tomato Pasta', price: 80.36, quantity: 1, img: '/assets/food/tomato-pasta.jpeg', Ingredients: '', title: 'Pasta' },
    { name: 'Classic Cheese Pizza', price: 25.36, quantity: 1, img: '/assets/food/classic-cheese-pizza.avif', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas' },
    { name: 'Fancy Pizza', price: 25.36, quantity: 1, img: '/assets/food/default-pizza.avif', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas' },
    { name: 'Salami Pizza', price: 25.36, quantity: 1, img: '/assets/food/Salami-pizza.jpg', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas' },
  ];
  
  constructor(public modal: NgbModal,private commonService:SessionStorageService,private cdr: ChangeDetectorRef) { 
 
  }

  ngOnInit() {
   this.loadItemsBySelectedTitle();
  }

  searchTerm(term: string) {
    // term ? this.addFix() : this.removeFix();
    // if (!term) return (this.menuItems = []);
    // let itemsData: menuItem[] = [];
    // term = term.toLowerCase();
    // this.items.forEach((data) => {
    //   if (!data?.title) return false;
    //   if (data.title.toLowerCase().includes(term) && data.type === "link") {
    //     itemsData.push(data);
    //   }
    //   if (!data.children) return false;
    //   data.children.filter((subItems: menuItem) => {
    //     if (
    //       subItems.title?.toLowerCase().includes(term) &&
    //       subItems.type === "link"
    //     ) {
    //       subItems.icon = data.icon;
    //       itemsData.push(subItems);
    //     }
    //     return;
    //   });
    //   this.checkSearchResultEmpty(itemsData);
    //   this.menuItems = itemsData;
    //   return;
    // });
    // return;
  }
  //  checkSearchResultEmpty(items: menuItem[]) {
  //     if (!items.length) this.searchResultEmpty = true;
  //     else this.searchResultEmpty = false;
  //   }
  
  //   addFix() {
  //     this.searchResult = true;
  //   }
  
  //   clickOutside(): void {
  //     this.searchText = "";
  //     this.searchResult = false;
  //     this.searchResultEmpty = false;
  //   }
  
  //   removeFix() {
  //     this.searchText = "";
  //     this.searchResult = false;
  //   }
  
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
  selectedItem = {
    name: 'Pizza',
    price: 32.0,
    pizzas: [{name:'Pizza1'}, {name:'Pizza2'} ],
    Ingredients: ['Cheese', 'Tomato'], // optional
    notes: ''
  };
  addMedia() {
    this.modal.open(AddMediaComponent, { windowClass: 'media-modal theme-modal', size: 'xl' })
  }
  addItem(item: CartItem) {
    this.itemAdded.emit(item);  // Emit the selected item
  }

  openIngredientsPopup(item: any) {
    // this.selectedItem = item;

    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }
  increaseQty() {
    this.quantity++;
  }
  
  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }
  
  addDish() {
    // logic to add dish to order/cart
    this.closePopup();
  }
  

toggleExpand(index: number) {
  this.expandedIndex = this.expandedIndex === index ? null : index;
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


