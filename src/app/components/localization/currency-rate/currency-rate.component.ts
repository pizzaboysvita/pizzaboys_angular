import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TableComponent } from "../../widgets/table/table.component";
import { TableConfig } from '../../../shared/interface/table.interface';
import { CurrencyRate } from '../../../shared/data/localization';

@Component({
    selector: 'app-currency-rate',
    templateUrl: './currency-rate.component.html',
    styleUrl: './currency-rate.component.scss',
    imports: [CardComponent, TableComponent]
})

export class CurrencyRateComponent {

    public tableConfig: TableConfig = { 
        columns: [
            { title: "Currency", dataField: 'currency_title'},
            { title: "USD", dataField: 'usd' },
            { title: "Code", dataField: 'code',class: 'font-secondary f-w-500' },   
            { title: "Exchange Rate", dataField: 'exchange_rate'},
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: CurrencyRate,
    };

}
