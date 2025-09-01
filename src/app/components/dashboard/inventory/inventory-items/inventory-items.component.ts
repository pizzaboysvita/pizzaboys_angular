import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-inventory-items',
  standalone: true,
  imports: [CommonModule, FormsModule], templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss'
})
export class InventoryItemsComponent {
  items: InventoryItem[] = [
    { id: 1, name: 'Tomatoes', quantity: 100, status: 'Active' },
    { id: 2, name: 'Cheese', quantity: 50, status: 'Inactive' },
    { id: 3, name: 'Onions', quantity: 70, status: 'Active' },
  ];

  searchName = '';
  searchStatus: 'All' | 'Active' | 'Inactive' = 'All';
  modalItem: InventoryItem = { id: 0, name: '', quantity: 0, status: 'Active' };
  isEdit = false;

  get filteredItems() {
    return this.items.filter(item =>
      (!this.searchName || item.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (this.searchStatus === 'All' || item.status === this.searchStatus)
    );
  }

  openAddModal() {
    this.isEdit = false;
    this.modalItem = { id: 0, name: '', quantity: 0, status: 'Active' };
    (document.getElementById('itemModal') as any)?.classList.add('show', 'd-block');
  }

  openEditModal(item: InventoryItem) {
    this.isEdit = true;
    this.modalItem = { ...item };
    (document.getElementById('itemModal') as any)?.classList.add('show', 'd-block');
  }

  closeModal() {
    (document.getElementById('itemModal') as any)?.classList.remove('show', 'd-block');
  }

  saveItem() {
    if (this.isEdit) {
      const idx = this.items.findIndex(i => i.id === this.modalItem.id);
      if (idx > -1) this.items[idx] = { ...this.modalItem };
    } else {
      this.modalItem.id = this.items.length + 1;
      this.items.push({ ...this.modalItem });
    }
    this.closeModal();
  }

  deleteItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }

  resetSearch() {
    this.searchName = '';
    this.searchStatus = 'All';
  }
}
