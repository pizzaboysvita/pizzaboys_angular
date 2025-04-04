import { Routes } from "@angular/router";
import { AttributesComponent } from "./attribute/attributes.component";
import { AddAttributesComponent } from "./add-attributes/add-attributes.component";

export default [
  {
    path: 'attributes',
    component: AttributesComponent,
  },
  {
    path: 'add-attributes',
    component: AddAttributesComponent
  }
] as Routes
