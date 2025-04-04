import { Routes } from "@angular/router";
import { CategoryListComponent } from "./category-list/category-list.component";
import { CreateCategoryComponent } from "./create-category/create-category.component";

export default [
    {
      path: 'category-list',
      component: CategoryListComponent,
    },
    {
        path: 'create-category',
        component: CreateCategoryComponent,
      }
] as Routes