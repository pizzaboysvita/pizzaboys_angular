import { Component } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { List, ListPage } from '../../shared/data/list-page';
import { TableConfig } from '../../shared/interface/table.interface';
import { TableComponent } from "../widgets/table/table.component";

@Component({
    selector: 'app-list-page',
    templateUrl: './list-page.component.html',
    styleUrl: './list-page.component.scss',
    imports: [CardComponent, TableComponent]
})

export class ListPageComponent {

    public listData = ListPage;
    public tableConfig: TableConfig = {
        columns: [
            { title: "Title", dataField: 'title' },
            { title: "Author", dataField: 'author' },
            { title: "Date", dataField: 'date' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.listData,
    }

    ngOnInit() {
        let list = this.listData.map((element :List) => {
            return {
                ...element,
                title: element.title ? `<div class="check-box-contain"><span class="theme-color f-w-600">${element.title}</span>${element.subTitle}</div>` : '-',
                date: element.date ? `<a href="javascript:void(0)"><span class="d-block font-black">${element.date_status}</span><span>${element.date}</span></a>` : '-'
            }
        })
            
        this.tableConfig.data = this.listData ? list : [];
    }
}
