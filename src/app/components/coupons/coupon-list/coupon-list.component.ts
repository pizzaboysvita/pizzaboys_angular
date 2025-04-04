import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TableConfig } from '../../../shared/interface/table.interface';
import { CouponList } from '../../../shared/data/coupon';
import { TableComponent } from "../../widgets/table/table.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-coupon-list',
    templateUrl: './coupon-list.component.html',
    styleUrl: './coupon-list.component.scss',
    imports: [CardComponent, TableComponent, RouterModule]
})

export class CouponListComponent {

    public coupon = CouponList;
    public tableConfig: TableConfig = {
        columns: [
            { title: "Title", dataField: 'title'},
            { title: "Code", dataField: 'code' },
            { title: "Discount", dataField: 'discount', class : 'font-secondary' },
            { title: "Status", dataField: 'status' , class :'menu-status'},
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.coupon,
    };

}
