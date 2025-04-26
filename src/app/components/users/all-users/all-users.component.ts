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
    stausList = ['Active', 'In-Active'];
    public tableConfig: TableConfig = {
        columns: [
            { title: "No", dataField: 'id', class: 'f-w-600' },
            { title: "User Photo", dataField: 'user_image', type: 'image', class: 'rounded' },
            { title: "Type", dataField: 'type' },
            { title: "Name", dataField: 'name' },
            { title: "Email", dataField: 'email', class: 'f-w-600' },
            { title: "Phone", dataField: 'phone' },
            { title: "Verified", dataField: 'Verified' },
            { title: "Created Date", dataField: 'CreatedDate' },
            { title: "Last Order Date", dataField: 'LastOrderDate' },
            { title: "No of Orders", dataField: 'NoofOrders' },
            { title: "Status", dataField: 'status' },
            { title: "Options", type: 'option' },
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.allUsers,
    };
    ngOnInit() {
        const statusClassMap: Record<string, string> = {
            'Ready To Pick': 'badge rounded border border-warning text-warning px-2 py-1',
            'Out Of Delivery': 'badge rounded border border-primary text-primary px-2 py-1',
            'Active': 'badge bg-success text-white px-2 py-1'
        };

        const order = this.allUsers.map(element => {
            return {
                ...element,
                status: element.status
                    ? `<span class="${statusClassMap[element.status] || 'badge bg-secondary'}">${element.status}</span>`
                    : '-',
            };
        });
        this.tableConfig.data = order;
    }
}