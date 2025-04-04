import { Component } from '@angular/core';
import { OrderTacking } from '../../../../shared/data/orders';
import { TableConfig } from '../../../../shared/interface/table.interface';
import { TableComponent } from "../../../widgets/table/table.component";

@Component({
    selector: 'app-tracker-table',
    templateUrl: './tracker-table.component.html',
    styleUrl: './tracker-table.component.scss',
    imports: [TableComponent]
})

export class TrackerTableComponent {

  public orderTacking = OrderTacking;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Date", dataField: 'date'},
      { title: "Time", dataField: 'time' },
      { title: "Description", dataField: 'description', class: 'fw-bold' },
      { title: "Location", dataField: 'location' },
    ],
    data: this.orderTacking,
  }

}
