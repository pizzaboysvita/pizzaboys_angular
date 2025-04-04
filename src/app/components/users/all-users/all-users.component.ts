import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeatherIconsComponent } from "../../../shared/components/feather-icons/feather-icons.component";
import { AllUsers } from '../../../shared/data/users';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-all-users',
    templateUrl: './all-users.component.html',
    styleUrl: './all-users.component.scss',
    imports: [FormsModule, RouterModule, FeatherIconsComponent, TableComponent, CardComponent]
})

export class AllUsersComponent {

    public allUsers = AllUsers;
    public tableConfig: TableConfig = {
        columns: [
            { title: "No", dataField: 'id',  class: 'f-w-600' },
            { title: "User", dataField: 'user_image', type: 'image', class: 'rounded' },
            { title: "Name", dataField: 'name' },
            { title: "Phone", dataField: 'phone' },
            { title: "Email", dataField: 'email', class: 'f-w-600' },
            { title: "Options", type: 'option' },
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.allUsers,
    };

}
