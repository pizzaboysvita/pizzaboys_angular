import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { IngredientsComponent } from '../ingredients/ingredients.component';
import { GroceryComponent } from '../grocery/grocery.component';
import { AddComponent } from '../add/add.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  },
  {
    path: 'dish',
    component: GroceryComponent
  },
  {
    path: 'ingredients',
    component: IngredientsComponent
  },
  {
    path: 'add-inventory',
    component: AddComponent
  }
];

export default routes;
