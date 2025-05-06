import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    imports: [CommonModule, NgbRatingModule, RouterModule, FormsModule]
})

export class TableComponent {

  @Input() tableConfig: any;
  @Input() hasCheckbox: boolean = false;
  @Input() search: boolean = false;
  @Input() tableClass : string;
  public searchText = ''; 
  public selected: number[] = [];

  constructor(public commonService: CommonService,
    public router: Router,
    public config: NgbRatingConfig) {
    config.max = 5,
      config.readonly = true;
  }

  filterData(searchText: string){
    if (!searchText) {
      return this.tableConfig.data;
    }
    return this.tableConfig.data.filter((item: { [x: string]: { toString: () => string; }; }) => {
      for (const key in item) {
        if (item[key].toString().toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
  }

  performAction(action: { icon: string, permission: string }) {
    if (action.permission === 'show') {
      this.router.navigate(['/orders/order-detail']);
    } else if (action.permission === 'delete') {
      this.commonService.warningModel()
    }
  }

  checkUncheckAll(event: Event) {
    this.tableConfig?.data!.forEach((item: any) => {
      item.isChecked = (<HTMLInputElement>event?.target)?.checked;
      this.setSelectedItem((<HTMLInputElement>event?.target)?.checked, item?.id);
    });
  }

  onItemChecked(event: Event) {
    this.setSelectedItem((<HTMLInputElement>event.target)?.checked, Number((<HTMLInputElement>event.target)?.value));
  }

  setSelectedItem(checked: Boolean, value: Number) {
    const index = this.selected.indexOf(Number(value));
    if (checked) {
      if (index == -1) this.selected.push(Number(value))
    } else {
      this.selected = this.selected.filter(id => id != Number(value));
    }
  }
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  onSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
  
    // Optionally trigger actual sorting of data here
  }
  getColorForName(name: string): string {
    if (!name) return '#6c757d'; // default fallback
  
    // Hash the name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Convert hash to HSL color
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 50%)`; // You can tweak saturation/lightness as needed
  }
  
}
