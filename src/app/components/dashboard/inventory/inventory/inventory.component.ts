import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuListComponent } from '../../../menus/menu-list/menu-list.component';
import { CategoryComponent } from '../../../menus/category/category.component';
import { AddMenusComponent } from '../../../menus/add-menus/add-menus.component';
import { OptionsetComponent } from '../../../optionset/optionset.component';
import { IngredientsComponent } from "../ingredients/ingredients.component";
import { GroceryComponent } from "../grocery/grocery.component";

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CardComponent, NgbNavModule, IngredientsComponent, GroceryComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  active = 1
}
