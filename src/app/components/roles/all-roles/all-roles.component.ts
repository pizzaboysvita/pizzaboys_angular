import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { FeatherIconsComponent } from "../../../shared/components/feather-icons/feather-icons.component";
import { RoleList } from '../../../shared/data/roles';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-all-roles',
    templateUrl: './all-roles.component.html',
    styleUrl: './all-roles.component.scss',
    imports: [FeatherIconsComponent, RouterModule, CardComponent, TableComponent]
})

export class AllRolesComponent {

    public roleList = RoleList;
    
    public tableConfig: TableConfig = {
        columns: [
            { title: "No", dataField: 'id' },
            { title: "Name", dataField: 'name' },
            { title: "Create At", dataField: 'create_at' },
            { title: "Options", type: 'option' },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.roleList,
    };

}
