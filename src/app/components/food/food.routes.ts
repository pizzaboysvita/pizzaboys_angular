import { Routes } from "@angular/router";
import { FoodListComponent } from "./food-list/food-list.component";
import { CreateFoodComponent } from "./create-food/create-food.component";

export default [
    {
         path:'food-list',
         component :FoodListComponent
    },
    {
        path:'create-food',
        component :CreateFoodComponent
   },
] as Routes;