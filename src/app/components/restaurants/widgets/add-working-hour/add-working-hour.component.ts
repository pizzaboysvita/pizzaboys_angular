import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";
import { CardComponent } from '../../../../shared/components/card/card.component';
import { TableComponent } from '../../../widgets/table/table.component';
import { TableConfig } from '../../../../shared/interface/table.interface';

@Component({
    selector: 'app-add-working-hour',
    templateUrl: './add-working-hour.component.html',
    styleUrl: './add-working-hour.component.scss',
    imports: [DropdownComponent,CardComponent,TableComponent]
})

export class AddWorkingHourComponent {

  constructor(public modal: NgbModal) { }
  public day = ['Select Days', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public tableConfig: TableConfig = {
    columns: [
      { title: "No", dataField: 'id', class: 'f-w-600' },
      { title: "Day", dataField: 'day' },
      { title: "From Time", dataField: 'fromTime', class: 'f-w-600' },
      { title: "To Time", dataField: 'totime' },
      { title: "Options", type: "option" },

      // { title: "Actions", dataField: '', class: 'action-column' } 
    ],
    rowActions: [
      { icon: "ri-pencil-line", permission: "edit" },
      { icon: "ri-delete-bin-line", permission: "delete" },
    ],
    data: [] // will be filled in ngOnInit
  };
  
  ngOnInit() {
    this.generateTableData();
  }
  
  private generateTableData() {
    const selectedDays = this.day.slice(1, 6); // Skip 'Select Days', get first 5 actual days
    this.tableConfig.data = selectedDays.map((day, index) => ({
      id: index + 1,
      day: day,
      fromTime: '09:00 AM',
      totime: '05:00 PM'
    }));
  }

}
