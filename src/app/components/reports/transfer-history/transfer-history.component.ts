import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TransactionHistory } from '../../../shared/data/reports';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-transfer-history',
    templateUrl: './transfer-history.component.html',
    styleUrl: './transfer-history.component.scss',
    imports: [CardComponent, TableComponent]
})

export class TransferHistoryComponent {

    public transaction = TransactionHistory ;
    public tableConfig: TableConfig = {
        columns: [
            { title: "Transfer Id", dataField: 'transfer_id', class: 'font-primary f-w-500' },
            { title: "Name", dataField: 'name' },
            { title: "Date", dataField: 'date' },
            { title: "Total", dataField: 'total' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "lnr lnr-pencil", permission: "edit" },
            { icon: "lnr lnr-trash", permission: "delete" },
        ],
        data: this.transaction,
    };

}
