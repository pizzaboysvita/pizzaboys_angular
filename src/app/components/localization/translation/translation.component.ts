import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { TranslationList } from '../../../shared/data/localization';
import { TableConfig } from '../../../shared/interface/table.interface';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-translation',
    templateUrl: './translation.component.html',
    styleUrl: './translation.component.scss',
    imports: [CardComponent, TableComponent]
})

export class TranslationComponent {

    public translation = TranslationList;
    public tableConfig: TableConfig = {
        columns: [
            { title: "User Key", dataField: 'user_key' },
            { title: "Russian", dataField: 'russian' },
            { title: "Arabic", dataField: 'arabic' },
            { title: "English", dataField: 'english' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.translation,
    };
}
