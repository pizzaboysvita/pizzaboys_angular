import { Component } from '@angular/core';
import { TableConfig } from '../../../shared/interface/table.interface';
import { staffList } from '../../../shared/data/products';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../widgets/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-list',
    imports: [CardComponent,TableComponent],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss'
})
export class StaffListComponent {
  constructor(private router:Router){}
    public products = staffList;
    stausList=['Active','In-Active']
    public tableConfig: TableConfig = {
        columns: [
          { title: "No", dataField: 'id', class: 'f-w-600' },
          { title: "Staff Photo", dataField: 'user_image', type: 'image', class: 'rounded' },
          // { title: "Type", dataField: 'type' },
          { title: "Name", dataField: 'name' },
          { title: "Email", dataField: 'email', class: 'f-w-600' },
          { title: "Phone", dataField: 'phone' },
            // { title: "Sno", dataField: 'id' },
            //  { title: "Staff Image", dataField: 'product_image', type: 'image' },
            // { title: "Name", dataField: 'product_name' },
            // { title: "Email", dataField: 'category' },
            // { title: "Phone", dataField: 'current_qty', class: 'f-w-500' },
            // // { title: "Address", dataField: 'price', class: 'td-price' },
            // // { title: "Status", dataField: 'status' },
            { title: "Options", type: "option" },
        ],
        rowActions: [
            { icon: "ri-eye-line", permission: "show" },
            { icon: "ri-pencil-line", permission: "edit" },
            { icon: "ri-delete-bin-line", permission: "delete" },
        ],
        data: this.products.map(user => {
          return {
            ...user,
            initial: !user.user_image && user.name ? user.name.trim().charAt(0).toUpperCase() : ''
          };
        })
        // data: this.products,
    };
    openNew(){
      this.router.navigate(["/staff/add-staff"]);

    }
}
