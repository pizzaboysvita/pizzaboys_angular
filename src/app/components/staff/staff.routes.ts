
import { Routes } from "@angular/router";
import { StaffListComponent } from "./staff-list/staff-list.component";
import { AddStaffComponent } from "./add-staff/add-staff.component";


export default [
    {
        path:'add-staff',
        component:AddStaffComponent
   },
    {
         path:'staff-list',
         component:StaffListComponent
    }
] as Routes;