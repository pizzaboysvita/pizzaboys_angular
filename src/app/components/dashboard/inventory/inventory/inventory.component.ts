import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InventoryItemsComponent } from '../inventory-items/inventory-items.component';
import { InventoryDishesComponent } from '../inventory-dishes/inventory-dishes.component';

@Component({
  selector: 'app-inventory',
   standalone: true,
  imports: [CommonModule, InventoryItemsComponent, InventoryDishesComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
activeTab: 'items' | 'dishes' = 'items';

  switchTab(tab: 'items' | 'dishes') {
    this.activeTab = tab;
  }
}
