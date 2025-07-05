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
import { ApisService } from "../../../shared/services/apis.service";
import { AppComponent } from "../../../app.component";
import { AppConstants } from "../../../app.constants";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import FileSaver from "file-saver";
import * as ExcelJS from 'exceljs';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  dish_menu_id: string;
  name: string;
  display_name: number;
  created_on:string;
  description: string;
  status: string;
}

@Component({
  selector: "app-add-menus",
  imports: [CardComponent, AgGridAngular, NgSelectModule],
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
      field: "dish_menu_id",
      headerName: "Menu Id",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: "name",
      headerName: "Menu Name",
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: "display_name",
      headerName: "Display Name",
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: "description",
      headerName: "Description",
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      field: 'created_on', headerName: 'Created Date', suppressMenu: true,
      unSortIcon: true,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
      }},
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




  public menuList = [
    { id: 1, name: "TakeWay Menu" },
    { id: 2, name: "Seasonal menu" },
    {
      id: 3,
      name: "Cycle menu",
    },
  ];
  menuItemsList: any = []
  menuData: any;
  constructor(public modal: NgbModal, private apis: ApisService, private session: SessionStorageService) { }



  ngOnInit() {
    this.getmenuList()
  }
  getmenuList() {
    console.log(JSON.parse(this.session.getsessionStorage('loginDetails') as any).user.user_id)
    this.apis.getApi(AppConstants.api_end_points.menu + '?user_id=' + JSON.parse(this.session.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
      if (data) {
        console.log(data)
        data.data.forEach((item: any) => {
          item.status = item.status == 1 ? 'Active' : item.status == 0 ? 'In-Active' : ''
        })
        this.menuItemsList = data.data

      }
    })
  }
  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.getAttribute("data-action");
    this.menuData = event.data;
    console.log(action)
    if (action === "view") {
      console.log(event.data)
   this.insertMenu('View')
    } else if (action === "edit") {
this.insertMenu("Edit")
    } else if (action === "delete") {
      // this.delete(event.data);
    }
  }
  insertMenu(type:any) {
    const modalRef =this.modal.open(AddMenuModalComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "lg",
    });
    console.log(this.menuData)
      modalRef.componentInstance.type =type
    modalRef.componentInstance.myData =this.menuData
  }
   downloadDevicesExcel(): void {
      if (!this.menuItemsList || this.menuItemsList.length === 0) {
        console.warn('No data to export.');
        return;
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Stores');
  
      // Define header row with styles
   const headers = Object.keys(this.menuItemsList[0]).map(key => {
  // Capitalize each word from snake_case or camelCase
  const formattedHeader = key
    .replace(/_/g, ' ')                           // snake_case -> snake case
    .replace(/([a-z])([A-Z])/g, '$1 $2')          // camelCase -> camel Case
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word

  return {
    header: formattedHeader,
    key: key,
    width: 20
  };
});
      worksheet.columns = headers;
  
      worksheet.getRow(1).eachCell((cell:any) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1F4E78' }, // dark blue
        };
      });
  
      // Add data rows
     this.menuItemsList.forEach((store: any) => {
  const row: Record<string, any> = {};
  
  Object.keys(store).forEach(key => {
    row[key] = store[key] ?? ''; // use '' for null or undefined
  });
   worksheet.addRow(row);
})
      // Create buffer and save
      workbook.xlsx.writeBuffer().then((data:any) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Menu List.xlsx');
      });
     
    }
}
