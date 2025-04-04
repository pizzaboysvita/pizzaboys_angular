import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/components/card/card.component";
import { FeatherIconsComponent } from "../../../shared/components/feather-icons/feather-icons.component";
import { TableConfig } from '../../../shared/interface/table.interface';
import { Attributes } from '../../../shared/data/atttribute';
import { TableComponent } from "../../widgets/table/table.component";

@Component({
    selector: 'app-attributes',
    templateUrl: './attributes.component.html',
    styleUrl: './attributes.component.scss',
    imports: [CardComponent, RouterModule, FeatherIconsComponent, FormsModule, TableComponent]
})

export class AttributesComponent {

    public attribute = Attributes;
    
    public tableConfig: TableConfig = {
        columns: [
            { title: "Name", dataField: 'name' },
            { title: "Options" ,type :'option' },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.attribute,
    };
}
