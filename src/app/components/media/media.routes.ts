import { Routes } from "@angular/router";
import { MediaComponent } from "./media.component";
import { AdminMediaComponent } from "./admin-media/admin-media.component";

export default [
    {
        path: '',
        component: MediaComponent
    },
    {
        path: 'admin-media',
        component: AdminMediaComponent
    }
] as Routes