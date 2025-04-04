import { Routes } from "@angular/router";
import { AddNewProductsComponent } from "./add-new-products/add-new-products.component";
import { ProductsComponent } from "./products/products.component";

export default [
    {
      path: 'products',
      component: ProductsComponent,
    },
    {
        path: 'add-new-products',
        component: AddNewProductsComponent,
      }
] as Routes