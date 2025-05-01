import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dish-selector',
  imports: [],
  templateUrl: './dish-selector.component.html',
  styleUrl: './dish-selector.component.scss'
})
export class DishSelectorComponent {

  selectedCategory = '';
  selectedDishes: string[] = [];
  selectedDish: string | null = null;
  @Output() dishSelected = new EventEmitter<string>();
  menuData: Record<string, string[]> = {
    'Classic Range Pizzas': ['Classic Range Pizzas'],
    'Vegetarian': [
      'M & M Pizza',
      'Cheese Lovers Pizza',
      'Margherita Pizza',
      'Creamy Mushroom Pizza',
      'Veg Delight Pizza',
      'Veg Supreme Pizza',
      'Crunchy Veg Pizza'
    ],
    'Chicken': ['Banana & Caramel Pizza'],
    'Meat': ['Meat Lovers Pizza'],
    'Seafood': ['Prawn Pizza', 'Tuna Melt']
  };
  categoryList = Object.keys(this.menuData);
  showModal: boolean=true;
  originalCategoryList: string[] = [];
  constructor(private eRef: ElementRef,public activeModal: NgbActiveModal) {
    // this.selectCategory(this.categoryList[0]);

  }
  ngOnInit() {
    // Set your original list here
    this.originalCategoryList = [...this.categoryList];
  }
  

  openModal() {
    this.showModal = true;
  }

  // selectCategory(category: string) {
  //   this.selectedCategory = category;
  //   this.selectedDishes = this.menuData[category];
  // }

  selectDish(dish: string) {
    this.activeModal.close(dish);

    // this.dishSelected.emit(dish); 
    this.selectedDish = dish;
    this.showModal = false; // Close modal
    // console.log('Selected Dish:', dish); // Pass to parent or emit event if needed
  }
 
  selectCategory(category: string) {
    this.selectedCategory = category;
  
    // Reorder list: selected first, others below
    // this.categoryList = [
    //   category,
    //   ...this.originalCategoryList.filter(cat => cat !== category)
    // ];
  }
  getOrderedCategoryList(): string[] {
    if (!this.selectedCategory) return this.categoryList;
  
    return [
      this.selectedCategory,
      ...this.categoryList.filter(cat => cat !== this.selectedCategory)
    ];
  }
  
  
  closeModal() {
    this.showModal = false;
  }
  trackByCategory(index: number, item: string): string {
    return item;
  }
  
  trackByDish(index: number, item: string): string {
    return item;
  }
  
}
