import { Routes } from "@angular/router";
import { AllRolesComponent } from "./all-roles/all-roles.component";
import { CreateRolesComponent } from "./create-roles/create-roles.component";

export default [
    {
        path: 'all-roles',
        component: AllRolesComponent
    },
    {
        path: 'create-role',
        component: CreateRolesComponent
    },
] as Routes