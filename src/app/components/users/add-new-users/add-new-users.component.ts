import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PermissionComponent } from "./permission/permission.component";
import { AccountComponent } from "./account/account.component";
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-add-new-users',
    templateUrl: './add-new-users.component.html',
    styleUrl: './add-new-users.component.scss',
    imports: [NgbNavModule, PermissionComponent, AccountComponent, CardComponent]
})

export class AddNewUsersComponent {

 public active = 1;

}
