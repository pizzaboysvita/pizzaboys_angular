import { Routes } from "@angular/router";
import { AddNewUsersComponent } from "./add-new-users/add-new-users.component";
import { AllUsersComponent } from "./all-users/all-users.component";

export default [
    {
        path: 'all-users',
        component: AllUsersComponent,
    },
    {
        path: 'add-new-user',
        component: AddNewUsersComponent,
    },
] as Routes;