import { Component } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { SupportTicket } from '../../shared/data/support-tickit';
import { TableConfig } from '../../shared/interface/table.interface';
import { TableComponent } from "../widgets/table/table.component";

@Component({
    selector: 'app-support-ticket',
    templateUrl: './support-ticket.component.html',
    styleUrl: './support-ticket.component.scss',
    imports: [CardComponent, TableComponent]
})

export class SupportTicketComponent {

    public supportData = SupportTicket;
    public tableConfig: TableConfig = {
        columns: [
            { title: "Ticket Number", dataField: 'ticket_number' },
            { title: "Date", dataField: 'date' },
            { title: "Subject", dataField: 'subject' },
            { title: "Status", dataField: 'status' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.supportData,
    };

    ngOnInit() {
        const product = this.supportData.map(element => {
            return {
                ... element,
                status: element.status ? `<div class="${element.status_class}"><span>${element.status}</span></div>` : '-'
            };
        });
        this.tableConfig.data = this.supportData ? product : [];
    }

}
