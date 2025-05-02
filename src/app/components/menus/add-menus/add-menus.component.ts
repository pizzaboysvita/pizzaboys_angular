import { Component } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
// import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from "../../../shared/interface/table.interface";
import { ProductsList } from "../../../shared/data/products";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddMenuModalComponent } from "../add-menu-modal/add-menu-modal.component";
import { NgSelectModule } from "@ng-select/ng-select";

ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  storename: string;
  email: string;
  phoneNumber: number;
  storeAddress: string;
  status: string;
}
interface RowData1 {
  menutype: string;
  categoryType: string;
  dishName: string;
  price: string;
  status: string;
  pos: string;
  misc: string;
}
@Component({
  selector: "app-add-menus",
  imports: [CardComponent, AgGridAngular,NgSelectModule],
  templateUrl: "./add-menus.component.html",
  styleUrl: "./add-menus.component.scss",
})
export class AddMenusComponent {
  modules = [ClientSideRowModelModule];
  public products = ProductsList;
  stausList = ["Active", "In-Active", "Pending"];
  columnDefs: ColDef<RowData>[] = [
    // <-- Important to give <RowData> here!
    {
      field: "storename",
      headerName: "Store Name",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: "email",
      headerName: "E-Mail",
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: "storeAddress",
      headerName: "Store Address",
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      suppressMenu: true,
      unSortIcon: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Active", "In-Active", "Pending"],
      },
      cellRenderer: (params: any) => {
        let statusClass = "";
        if (params.value === "Active") {
          statusClass = "status-active";
        } else if (params.value === "In-Active") {
          statusClass = "status-no-stock";
        } else if (params.value === "Pending") {
          statusClass = "status-hide";
        }
        if (params.value === "") {
          return `
            <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="No Stock">IN-Active</option>
              <option value="Hide">Pending</option>
            </select>
          `;
        }

        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      
    },

    {
      headerName: "Actions",
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px;">
          <button class="btn btn-sm  p-0" data-action="view" title="View">
         <span class="material-symbols-outlined text-primary">
visibility
</span>
          </button>
          <button class="btn btn-sm p-0" data-action="edit" title="Edit">
         <span class="material-symbols-outlined text-success">
edit
</span>
          </button>
          <button class="btn btn-sm p-0" data-action="delete" title="Delete">
        <span class="material-symbols-outlined text-danger">
delete
</span>
          </button>
        </div>
      `;
      },
      minWidth: 150,
      flex: 1,
    },
  ];

  rowData: RowData[] = [
    {
      storename: "Toyota",
      email: "Celica",
      status: "Active",
      phoneNumber: 35000,
      storeAddress: "Abc Address",
    },
    {
      storename: "Ford",
      email: "Mondeo",
      status: "In-Active",
      phoneNumber: 32000,
      storeAddress: "Abc Address",
    },
    {
      storename: "Porsche",
      email: "Boxster",
      status: "Pending",
      phoneNumber: 72000,
      storeAddress: "Abc Address",
    },
  ];

  rowData1: RowData1[] = [
    {
      menutype: "TakeWay Menu",
      categoryType: "Valentines Day Promotion",
      status: "",
      dishName: "Pizza chicken",
      price: "85",
      pos: "Hide in POS",
      misc: "Cancel",
    },
    {
      menutype: "Seasonal menu",
      categoryType: "Limited Time Deal",
      status: "No Stock",
      dishName: "Pizza chicken",
      price: "90",
      pos: "",
      misc: "",
    },
    {
      menutype: "Seasonal menu",
      categoryType: "Lunch",
      status: "Hide",
      dishName: "Pizza chicken",
      price: "15",
      pos: "Hide in POS",
      misc: "Cancel",
    },
  ];
  public menuList = [
    { id: 1, name: "TakeWay Menu" },
    { id: 2, name: "Seasonal menu" },
    {
      id: 3,
      name: "Cycle menu",
    },
  ];
  constructor(public modal: NgbModal) {}

  public tableConfig: TableConfig = {
    columns: [
      // { title: "Product Image", dataField: 'product_image', type: 'image' },
      { title: "Store Name", dataField: "product_name" },
      { title: "Email", dataField: "category" },
      { title: "Phone", dataField: "current_qty", class: "f-w-500" },
      { title: "Address", dataField: "price", class: "td-price" },
      { title: "Status", dataField: "status" },
      { title: "Options", type: "option" },
    ],
    rowActions: [
      { icon: "ri-eye-line", permission: "show" },
      { icon: "ri-pencil-line", permission: "edit" },
      { icon: "ri-delete-bin-line", permission: "delete" },
    ],
    data: this.products,
  };
  onCellClicked(event: any) {
    if (event.event.target && event.event.target.dataset.action) {
      const action = event.event.target.dataset.action;
      const rowData = event.data;

      if (action === "view") {
        console.log("Viewing", rowData);
      } else if (action === "edit") {
        console.log("Editing", rowData);
      } else if (action === "delete") {
        console.log("Deleting", rowData);
      }
    }
  }
  insertMenu() {
    this.modal.open(AddMenuModalComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "lg",
    });
  }
}
