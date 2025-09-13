import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { IngredientsComponent } from "../ingredients/ingredients.component";
import { GroceryComponent } from "../grocery/grocery.component";
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CardComponent, NgbNavModule, GroceryComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  active = 1
}
