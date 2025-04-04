import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { createRoles } from '../../../shared/data/roles';

@Component({
    selector: 'app-create-roles',
    templateUrl: './create-roles.component.html',
    styleUrl: './create-roles.component.scss',
    imports: [CardComponent]
})

export class CreateRolesComponent {

    public createRoles = createRoles ;

}
