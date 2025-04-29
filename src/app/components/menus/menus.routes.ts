import { Routes } from "@angular/router";
import { MenusComponent } from "./menus/menus.component";
import { MenuListComponent } from "./menu-list/menu-list.component";


export default [
    {
        path:'',
        component:MenusComponent
    },
{
    path:'list',
    component:MenuListComponent
}
]as Routes;