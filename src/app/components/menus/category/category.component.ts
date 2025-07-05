import { Component, OnInit } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddCategoryComponent } from "../add-category/add-category.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { ApisService } from "../../../shared/services/apis.service";

ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  dish_menu_id: string;
  name: string;
  display_name: string;
  price: string;
  status: string;
  hide_category_in_POS: string;
  misc: string;
}
@Component({
  selector: "app-category",
  imports: [CardComponent, AgGridAngular, NgSelectModule],
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
})
export class CategoryComponent implements OnInit {
  modules = [ClientSideRowModelModule];
  stausList = ["Active", "No Stock", "Hide"];

  rowData: RowData[] = [];
  public categoryList = [];
 
  columnDefs: ColDef<RowData>[] = [
    {
      field: "dish_menu_id",
      headerName: "Menu Type",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "dish_menu_id",
    },
    {
      field: "name",
      headerName: "Category Name",
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "name",
    },
    {
      field: "display_name",
      headerName: "Dispaly Name",
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "display_name",
    },
    {
      field: "price",
      headerName: "Price ($)",
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "price",
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => {
        let statusClass = "";
        if (params.value === "Active") {
          statusClass = "status-active";
        } else if (params.value === "No Stock") {
          statusClass = "status-no-stock";
        } else if (params.value === "Hide") {
          statusClass = "status-hide";
        }
        if (params.value === "") {
          return `
            <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="No Stock">No Stock</option>
              <option value="Hide">Hide</option>
            </select>
          `;
        }
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true, 
      cellEditor: "agSelectCellEditor", 
      cellEditorParams: {
        values: ["Active", "No Stock", "Hide"], 
      },
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      headerName: "POS",
      field: "hide_category_in_POS",
      cellRenderer: (params: any) => {
        let statusClass = "";
        if (params.value === "Hide in POS") {
          statusClass = "hide-pos";
        } else if (params.value === "Show in POS") {
          statusClass = "show-pos";
        }
        if (params.value === "") {
          return `
            <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                <option value="">Select POS</option>
              <option value="showinpos">Show in POS</option>
              <option value="hideinpos">Hide in POS</option>
              
            </select>
          `;
        }
        return `<div class="pos-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true, 
      cellEditor: "agSelectCellEditor", 
      cellEditorParams: {
        values: ["Hide in POS", "Show in POS"],
      },
      suppressMenu: true,
      unSortIcon: true,
    },
    {
      headerName: "MISC",
      field: "misc",
      cellRenderer: (params: any) => {
        let statusClass = "";
        if (params.value === "Cancel") {
          statusClass = "status-active";
        } else if (params.value === "Delete") {
          statusClass = "status-no-stock";
        }
        if (params.value === "") {
          return `
            <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                <option value="">Select MISC</option>
              <option value="Cancel">Cancel</option>
              <option value="Delete">Delete</option>
          
            </select>
          `;
        }
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true,
      cellEditor: "agSelectCellEditor", 
      cellEditorParams: {
        values: ["Cancel", "Delete"], 
      },
      suppressMenu: true,
      unSortIcon: true,
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
  categoryRowData: any;

  constructor(
    public modal: NgbModal,
    private apiService: ApisService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    const loginRaw = this.sessionStorage.getsessionStorage("loginDetails");
    const loginData = loginRaw ? JSON.parse(loginRaw) : null;
    const userId = loginData?.user?.user_id;
    console.log(userId, 'user id');
    

    if (!userId) {
      console.error("No user ID found in session");
      return;
    }

    this.apiService
      .getApi(`/api/category?user_id=${userId}`)
      .subscribe((res: any) => {

        console.log(res, 'categories response');
        
        if (res.code === "1") {
          this.rowData = res.categories

          
        } else {
          console.error("Failed to load categories:", res.message);
        }
      });
  }

   onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.getAttribute("data-action");
    this.categoryRowData = event.data;
    console.log(this.categoryRowData)
    if (action === "view") {
      console.log(event.data)
   this.insertCategory('View')
    } else if (action === "edit") {
this.insertCategory("Edit")
    } else if (action === "delete") {
      // this.delete(event.data);
    }
  }
  insertCategory(type:any) {
    const modalRef = this.modal.open(AddCategoryComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "lg",
    });
     modalRef.componentInstance.type =type
    modalRef.componentInstance.myData =this.categoryRowData
    modalRef.closed.subscribe((result) => {
      if (result === "refresh") {
        this.fetchCategories();
      }
    });
  }
}
