import { Routes } from "@angular/router";
import { MenusComponent } from "./menus/menus.component";
import { MenuListComponent } from "./menu-list/menu-list.component";
import { CategoryComponent } from "./category/category.component";
import { AddMenusComponent } from "./add-menus/add-menus.component";


export default [
    {
        path:'',
        component:MenusComponent
    },
{
    path:'dish',
    component:MenuListComponent
},
{
    path:'category',
    component:CategoryComponent
},
{
    path:'list',
    component:AddMenusComponent
}
]as Routes;