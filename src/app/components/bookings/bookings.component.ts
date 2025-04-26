import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { TableConfig } from '../../shared/interface/table.interface';
import { TableComponent } from '../widgets/table/table.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
  imports: [FormsModule, RouterModule, FeatherIconsComponent, TableComponent, CardComponent]
})
export class BookingsComponent {

  public bookings = [
    {
      id: '01.',
      name: "Liam Johnson",
      email: "liam.johnson@example.com",
      phone: "+1 555-234-5678",
      bookingsFor: "Family Meal",
      placed: "2025-04-25",
      noOfPeople: "4",
      status: "Active",
    },
    {
      id: '02.',
      name: "Emma Williams",
      email: "emma.williams@example.com",
      phone: "+1 555-987-6543",
      bookingsFor: "Birthday Party",
      placed: "2025-04-24",
      noOfPeople: "12",
      status: "Active",
    },
    {
      id: '03.',
      name: "Noah Smith",
      email: "noah.smith@example.com",
      phone: "+1 555-123-7890",
      bookingsFor: "Corporate Lunch",
      placed: "2025-04-23",
      noOfPeople: "20",
      status: "Inactive",
    },
    {
      id: '04.',
      name: "Olivia Brown",
      email: "olivia.brown@example.com",
      phone: "+1 555-456-3210",
      bookingsFor: "Casual Dinner",
      placed: "2025-04-26",
      noOfPeople: "2",
      status: "Active",
    },
    {
      id: '05.',
      name: "William Davis",
      email: "william.davis@example.com",
      phone: "+1 555-654-9870",
      bookingsFor: "School Event",
      placed: "2025-04-22",
      noOfPeople: "50",
      status: "Inactive",
    },
    {
      id: '06.',
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      phone: "+1 555-789-0123",
      bookingsFor: "Family Gathering",
      placed: "2025-04-21",
      noOfPeople: "6",
      status: "Active",
    },
    {
      id: '07.',
      name: "James Martinez",
      email: "james.martinez@example.com",
      phone: "+1 555-321-6789",
      bookingsFor: "Anniversary",
      placed: "2025-04-20",
      noOfPeople: "3",
      status: "Active",
    },
    {
      id: '08.',
      name: "Isabella Rodriguez",
      email: "isabella.rodriguez@example.com",
      phone: "+1 555-987-1234",
      bookingsFor: "Friends Reunion",
      placed: "2025-04-19",
      noOfPeople: "8",
      status: "Inactive",
    }
  ];
  stausList = ['Active', 'In-Active'];
  public tableConfig: TableConfig = {
    columns: [
      { title: "No", dataField: 'id', class: 'f-w-600' },
      { title: "Name", dataField: 'name' },
      { title: "Email", dataField: 'email', class: 'f-w-600' },
      { title: "Phone", dataField: 'phone' },
      { title: "Bookings For", dataField: 'bookingsFor' },
      { title: "Placed On", dataField: 'placed' },
      { title: "No of People", dataField: 'noOfPeople' },
      { title: "Status", dataField: 'status' },
      { title: "Options", type: 'option' },
    ],
    rowActions: [
      { icon: "ri-eye-line", permission: "show" },
      { icon: "ri-pencil-line", permission: "edit" },
      { icon: "ri-delete-bin-line", permission: "delete" },
    ],
    data: this.bookings,
  };
  ngOnInit() {
    const statusClassMap: Record<string, string> = {
      'Active': 'badge bg-success text-white px-2 py-1'
    };

    const order = this.bookings.map(element => {
      return {
        ...element,
        status: element.status
          ? `<span class="${statusClassMap[element.status] || 'badge bg-secondary'}">${element.status}</span>`
          : '-',
      };
    });
    this.tableConfig.data = order;
  }
}