import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
interface InventoryDishItem {
  id: number;
  dishname: string;
  quantity: number;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-inventory-dishes',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './inventory-dishes.component.html',
  styleUrl: './inventory-dishes.component.scss'
})
export class InventoryDishesComponent {
  dishes: InventoryDishItem[] = [
    { id: 1, dishname: 'Paneer Butter Masala', quantity: 50, status: 'Active' },
    { id: 2, dishname: 'Veg Biryani', quantity: 30, status: 'Active' },
    { id: 3, dishname: 'Chicken Curry', quantity: 0, status: 'Inactive' }
  ];

  searchName = '';
  searchStatus: 'All' | 'Active' | 'Inactive' = 'All';
  modalDish: InventoryDishItem = { id: 0, dishname: '', quantity: 0, status: 'Active' };
  isEdit = false;

  get filteredDishes() {
    return this.dishes.filter(dish =>
      (!this.searchName || dish.dishname.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (this.searchStatus === 'All' || dish.status === this.searchStatus)
    );
  }

  openAddModal() {
    this.isEdit = false;
    this.modalDish = { id: 0, dishname: '', quantity: 0, status: 'Active' };
    (document.getElementById('dishModal') as any)?.classList.add('show', 'd-block');
  }

  openEditModal(dish: InventoryDishItem) {
    this.isEdit = true;
    this.modalDish = { ...dish };
    (document.getElementById('dishModal') as any)?.classList.add('show', 'd-block');
  }

  closeModal() {
    (document.getElementById('dishModal') as any)?.classList.remove('show', 'd-block');
  }

  saveDish() {
    if (this.isEdit) {
      const idx = this.dishes.findIndex(d => d.id === this.modalDish.id);
      if (idx > -1) this.dishes[idx] = { ...this.modalDish };
    } else {
      this.modalDish.id = this.dishes.length + 1;
      this.dishes.push({ ...this.modalDish });
    }
    this.closeModal();
  }

  deleteDish(id: number) {
    this.dishes = this.dishes.filter(d => d.id !== id);
  }

  resetSearch() {
    this.searchName = '';
    this.searchStatus = 'All';
  }
}
