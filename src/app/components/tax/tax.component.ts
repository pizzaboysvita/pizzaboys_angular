import { Component } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { Taxes } from '../../shared/data/tax';
import { TableConfig } from '../../shared/interface/table.interface';
import { TableComponent } from "../widgets/table/table.component";

@Component({
    selector: 'app-tax',
    templateUrl: './tax.component.html',
    styleUrl: './tax.component.scss',
    imports: [TableComponent, CardComponent]
})

export class TaxComponent {

    public tax = Taxes;
    public tableConfig: TableConfig = {
        columns: [
            { title: "Tax Detail", dataField: 'tax_detail' },
            { title: "Tax Schedule", dataField: 'tax_schedule' },
            { title: "Tax Rate", dataField: 'tax_rate', class: 'f-w-600' },
            { title: "Total Tax Amount", dataField: 'total_tax_amount' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.tax,
    };

    ngOnInit() {
        let tasIcon = this.tax.map(element => {
            return {
                ...element,
                tax_schedule: element.tax_schedule ? `${element.tax_schedule} <span class="theme-color">*</span>` : '-'
            }
        })
        this.tableConfig.data = this.tax ? tasIcon : [];
    }

}
