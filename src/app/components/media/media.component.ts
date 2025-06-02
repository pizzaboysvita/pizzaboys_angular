import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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
import { DishSelectorComponent } from './dish-selector/dish-selector.component';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss',
    imports: [CardComponent,CommonModule,FormsModule]
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
  @Output() itemDecreased = new EventEmitter<CartItem>();

  itemsList:CartItem[] = [];
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  selectedCategory: any;

scrollLeft() {
  this.scrollContainer.nativeElement.scrollBy({ left: -150, behavior: 'smooth' });
}

scrollRight() {
  this.scrollContainer.nativeElement.scrollBy({ left: 150, behavior: 'smooth' });
}

 categories = [
  { name: 'Breakfast', count: 72, image: '/assets/food/chicken-tacos.jpg' },
  { name: 'Beverages', count: 35, image: '/assets/food/chicken-tacos.jpg' },
  { name: 'Classic Range Pizzas', count: 24, image: '/assets/food/chicken-tacos.jpg' },
  { name: 'Non Vegetarian', count: 20, image: '/assets/food/chicken-tacos.jpg' },
  { name: 'Pasta', count: 24, image: '/assets/food/chicken-tacos.jpg' },
  { name: 'Drinks', count: 32, image: '/assets/food/chicken-tacos.jpg' },
];
 
   items = [
         { name: 'Chicken Tacos', price: 20.36, quantity: 0, img: '/assets/food/chicken-tacos.jpg', Ingredients: '', title: 'Beverages', status: 'Available' },
    { name: 'Chicken Tacos', price: 20.36,quantity: 0, img: '/assets/food/chicken-Roll.jpg', Ingredients: '', title: 'Beverages', status: 'Not Available' },
    { name: 'Chicken Tacos', price: 20.36,quantity: 0, img: '/assets/food/chicken-cutlet.jpg', Ingredients: '', title: 'Beverages', status: 'Available' },
     { name: 'Egg Bhurji', price: 20.36, quantity: 0, img: '/assets/food/egg-bhurji.jpg', Ingredients: '', title: 'Breakfast', status: 'Available' },
    { name: 'Poori Masala', price: 20.36,quantity: 0, img: '/assets/food/Poori-Masala.jpg', Ingredients: '', title: 'Breakfast', status: 'Not Available' },
    { name: 'Butter Bread', price: 20.36,quantity: 0, img: '/assets/food/butterbread.webp', Ingredients: '', title: 'Breakfast', status: 'Available' },
    { name: 'Chicken Tacos', price: 20.36, quantity: 0, img: '/assets/food/chicken-tacos.jpg', Ingredients: '', title: 'Non Vegetarian', status: 'Available' },
    { name: 'Chicken Tacos', price: 20.36,quantity: 0, img: '/assets/food/chicken-Roll.jpg', Ingredients: '', title: 'Non Vegetarian', status: 'Not Available' },
    { name: 'Chicken Tacos', price: 20.36,quantity: 0, img: '/assets/food/chicken-cutlet.jpg', Ingredients: '', title: 'Non Vegetarian', status: 'Available' },
    { name: 'Italian Pasta', price: 18.30,quantity: 0, img: '/assets/food/italian-pasta.jpg', Ingredients: 'wheat flour or semolina, eggs (sometimes), and sometimes olive oil. Other ingredients, like tomatoes, garlic, herbs (basil, oregano), and cheese,', title: 'Pasta', status: 'Not Available' },
    { name: 'Beetroot', price: 30.36,quantity: 0, img: '/assets/food/beetroot_juice.avif', Ingredients: '', title: 'Drinks', status: 'Available' },
    { name: 'Salad', price: 80.36,quantity: 0, img: '/assets/food/salads.png', Ingredients: '', title: 'Non Vegetarian', status: 'Not Available' },
    { name: 'Soft Drinks', price: 30.36,quantity: 0, img: '/assets/food/cool-drinks.jpg', Ingredients: '', title: 'Drinks', status: 'Available' },
    { name: 'Juice', price: 80.36,quantity: 0, img: '/assets/food/cool-drinks3.jpg', Ingredients: '', title: 'Drinks', status: 'Not Available' },
    { name: 'Juice', price: 80.36,quantity: 0, img: '/assets/food/cool-drinks2.jpeg', Ingredients: '', title: 'Drinks', status: 'Available' },
    { name: 'Pasta Spaghetti', price: 30.36,quantity: 0, img: '/assets/food/pasta-img.avif', Ingredients: '', title: 'Pasta', status: 'Not Available' },
    { name: 'panne Pasta Stock', price: 80.36,quantity: 0, img: '/assets/food/istock-Pasta.jpg', Ingredients: '', title: 'Pasta', status: 'Available' },
    { name: 'Spicy Penne Pasta', price: 80.36,quantity: 0, img: '/assets/food/Spicy-Penne-Pasta.png', Ingredients: '', title: 'Pasta', status: 'Not Available' },
    { name: 'Tomato Pasta', price: 80.36,quantity: 0, img: '/assets/food/tomato-pasta.jpeg', Ingredients: '', title: 'Pasta', status: 'Available' },
    { name: 'Classic Cheese Pizza', price: 25.36,quantity: 0, img: '/assets/food/classic-cheese-pizza.avif', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas', status: 'Not Available' },
    { name: 'Fancy Pizza', price: 25.36,quantity: 0, img: '/assets/food/default-pizza.avif', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas', status: 'Available' },
    { name: 'Salami Pizza', price: 25.36,quantity: 0, img: '/assets/food/Salami-pizza.jpg', Ingredients: 'dough base, pizza sauce, mozzarella cheese, and a variety of toppings. The dough base is made from flour, water, yeast, and sometimes oil or sugar. The', title: 'Classic Range Pizzas', status: 'Not Available' },
  ];
  
  selectedDish: string;
  showModal: boolean;
  selectedDishes: string[] = [];

  
  constructor(public modal: NgbModal,private commonService:SessionStorageService,private cdr: ChangeDetectorRef) { 
 
  }

  ngOnInit() {
  //  this.loadItemsBySelectedTitle();
  this.selectCategory(this.categories[0])
  }




  searchTerm(term: string) {
   
  }
  loadItemsBySelectedTitle() {
    const navigationState = history.state;
    const savedTitle = this.commonService.getSelectedMenuTitle();
  
    // Case 1: First login or navigation with title in router.navigate({ state: { title: '...' } })
    if (navigationState && navigationState.title) {
      this.selectedTitle1 = navigationState.title;
      this.itemsList = this.items.filter(item => item.title.trim() === navigationState.title.trim());
  
      // Save to service for future refreshes or page reloads
      this.commonService.setSelectedMenuTitle(navigationState.title);
  
      // Clear the title in state to avoid reloading on refresh
      history.replaceState({}, '');
    } 
    // Case 2: Already saved in service (page refresh or later use)
    else if (savedTitle) {
      this.selectedTitle1 = savedTitle;
      this.itemsList = this.items.filter(item => item.title.trim() === savedTitle.trim());
    } 
    // Optional: fallback to a default category
    else {
      this.selectedTitle1 = 'Classic Range Pizzas'; // or any default
      this.itemsList = this.items.filter(item => item.title.trim() === this.selectedTitle1);
      this.commonService.setSelectedMenuTitle(this.selectedTitle1);
    }
  
    // Subscribe to future changes
    this.commonService.selectedMenuTitle$.subscribe(title => {
      if (title && title.trim()) {
        this.selectedTitle1 = title;
        this.itemsList = this.items.filter(item => item.title.trim() === title.trim());
      }
    });
  
    console.log('Selected Title:', this.selectedTitle1);
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
    pizzas: [{name:'Pizza1',type:''}, {name:'Pizza2',type:'Pizza2'} ],
    Ingredients: ['Cheese', 'Tomato'], // optional
    notes: ''
  };
  addMedia() {
    this.modal.open(AddMediaComponent, { windowClass: 'media-modal theme-modal', size: 'xl' })
  }
  addItem(item: CartItem) {
   item.quantity = 1;
    this.itemAdded.emit(item);  // Emit the selected item
  }

decreaseItem(item: CartItem) {
  if (item.quantity && item.quantity > 1) {
    item.quantity--;
    this.itemDecreased.emit(item);
  } else {
    // Optional: emit item with quantity 0 to remove
    item.quantity = 0;
    this.itemDecreased.emit(item);
  }
}
increaseItem(item: any) {
  item.quantity++;
     this.itemAdded.emit(item);  // Emit the selected item

}

selectCategory(category:any){
  this.itemsList = this.items.filter(item => item.title.trim() === category.name.trim());
   this.selectedCategory=category
}
  openIngredientsPopup(item: any) {
    // this.selectedItem = item;
  if(item.status=='Available'){
    this.showPopup = true;

  }
else{
  this.showPopup = false;

}

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
dishSelector(i: number) {
  //   this.modal.open(DishSelectorComponent,{
//     windowClass:'theme-modal',centered:true
// })
// }
  const modalRef = this.modal.open(DishSelectorComponent, {
    windowClass: 'theme-modal',
    centered: true
  });

  modalRef.result.then(
    (dish: string) => {
      this.selectedDishes[i] = dish;
    },
    (reason) => {}
  );

}

// onDishSelected(dish: string) {
//   this.selectedDish = dish;
//   console.log(this.selectedDish);
  
//   this.showModal = false; // close modal
//   // Optionally add dish to cart or form
// }

}
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img?: string;
  Ingredients:string;
  title:string;
  status:string;
}


