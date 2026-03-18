import { Component, TemplateRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CardComponent } from "../../../shared/components/card/card.component";
import { AgGridAngular } from "@ag-grid-community/angular";
import {
  CellClickedEvent,
  ColDef,
  ITooltipParams,
} from "@ag-grid-community/core";
import { Router } from "@angular/router";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule } from "@angular/common";

interface RowData {
  store_name: String;
  store_id: number;
  log_date: string;
  login_time: string;
  logout_time: string;
  break_time: string;
  // user_id:
}
@Component({
  selector: "app-view-timesheet",
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    AgGridAngular,
    NgSelectModule,
    CommonModule
  ],
  templateUrl: "./view-timesheet.component.html",
  styleUrl: "./view-timesheet.component.scss",
})
export class ViewTimesheetComponent {
  @ViewChild("confirmModal") confirmModalRef!: TemplateRef<any>;
  gridOptions = {
    pagination: true,
  };
  SheetForm: FormGroup;
  storeData: any;
  storesList: any[] = [];
  sheetList: any[] = [];
  storeListSorting: any[] = [];
  sheetListBackup: any;

  constructor(
    private router: Router,
    private apis: ApisService,
    private fb: FormBuilder,
    private session: SessionStorageService,
    private modalService: NgbModal,
  ) {}

  columnDefs: ColDef<RowData>[] = [
    {
      headerName: "Store Name",
      field: "store_id",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      valueGetter: (params: any) => this.storeNameData(params.data.store_id),
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "log_date",
      headerName: "Log Date",
      sortable: true,
      suppressHeaderMenuButton: true,
      valueFormatter: (params: any) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "login_time",
      headerName: "Login Time",
      sortable: true,
      suppressHeaderMenuButton: true,
      valueFormatter: (params: any) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      field: "break_time",
      headerName: "Break Time",
      sortable: true,
      suppressHeaderMenuButton: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "logout_time",
      headerName: "Logout Time",
      sortable: true,
      suppressHeaderMenuButton: true,
      valueFormatter: (params: any) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

  ngOnInit() {
  this.getStoreList();
  this.getFormStore();

  // this.getTimesheetList();
}
  getFormStore() {
    this.SheetForm = this.fb.group({
      store_id: [this.storesList ? this.storesList[0]?.store_id : null],
    });
  }
  getStoreList() {
    this.apis
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((res: any) => {
        console.log("Store List:", res);
        this.storesList = res;
        this.SheetForm.get("store_id")?.setValue(this.storesList[0]?.store_id || null);
        this.onStoreChange(this.storesList[0]);
      });
  }
  storeNameData(storeId: any) {
    const store = this.storesList.find((s: any) => s.store_id == storeId);
    return store ? store.store_name : "--";
  }
//   onStoreChange(storeId: any) {
//     this.sheetList =[];
//     this.storeListSorting =[];
//   console.log('Selected Store ID:', storeId.store_id);
//   this.apis.getApi(`/api/timesheet?store_id=${storeId.store_id}`).subscribe((res: any) => {
//       console.log("Timesheet API:", res);

//       this.sheetList = res.timesheets; // 🔥 important line
//       this.storeListSorting = res.timesheets;
//     });
// }

  onStoreChange(storeId: any) {
  this.sheetList = [];
  this.storeListSorting = [];

  const url = `${AppConstants.api_end_points.timeSheet}?store_id=${storeId.store_id}`;
  console.log("API URL:", url);

  this.apis.getApi(url).subscribe((res: any) => {
    console.log("Timesheet API Response:", res);

    this.sheetList = res.timesheets;
    this.storeListSorting = res.timesheets;
  });
}
  
    // ✅ Search (Frontend Filtering)
  search() {
  const storeId = this.SheetForm.value.store_id;

  console.log("Selected Store ID:", storeId);
  console.log("Store List Sorting:", this.storeListSorting);

  if (!this.storeListSorting || this.storeListSorting.length === 0) {
    console.warn("No data available to filter");
    return;
  }

  if (!storeId) {
    this.sheetList = this.storeListSorting;
    return;
  }

  this.sheetList = this.storeListSorting.filter((item: any) => {
    return item.store_id == storeId;
  });

  console.log("Filtered List:", this.sheetList);
}

  reset() {
  this.SheetForm.reset();
  this.getTimesheetList();
}

  // getstoreList(){
  //   this.apis.getApi(AppConstants.api_end_points.store_list).subscribe((data: any) => {
  //         console.log(data)
  //         data.forEach((element: any) => {
  //           element.status =element.status == 1
  //       ? "Active"
  //       : element.status == 0
  //         ? "Inactive"
  //         : element.status == 2
  //           ? "Pending"
  //           : "";
  //         })
  //         this.sheetList = data.reverse()
  //         this.storeListSorting = data.reverse()
  //       })
  // }
  getTimesheetList() {
   this.apis
    .getApi(`${AppConstants.api_end_points.timeSheet}?store_id=-1`)
    .subscribe((res: any) => {
      console.log("Timesheet API:", res);

      this.sheetList = res.timesheets; 
      this.storeListSorting = res.timesheets;
    });
  }

  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    while (target && !target.dataset?.["action"] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, "target action");
    const action = target?.dataset?.["action"];
    const rowData = event.data;
    console.log(action, "action");
    if (action) {
      switch (action) {
        case "view":
          console.log("Viewing:", rowData);
          this.session.setsessionStorage("storeType", "view");
          this.session.setsessionStorage(
            "storeDetails",
            JSON.stringify(rowData),
          );
          this.router.navigate(["/timesheet/view-timesheet"]);
          break;
        case "edit":
          console.log("Editing:", rowData);
          this.session.setsessionStorage("storeType", "edit");
          this.session.setsessionStorage(
            "storeDetails",
            JSON.stringify(rowData),
          );
          this.router.navigate(["/timesheet/view-timesheet"]);
          break;
        case "delete":
          console.log("Deleting:", rowData);
          this.storeData = rowData;
          this.openConfirmPopup();
          break;
      }
    }
  }
  openConfirmPopup() {
    this.modalService.open(this.confirmModalRef, {
      centered: true,
      backdrop: "static",
    });
  }

  onConfirm(modal: any) {
    // modal.close();
    // Perform your confirm logic here
    const req_body = {
      store_id: this.storeData.store_id,
    };
    this.apis
      .deleteApi(
        AppConstants.api_end_points.store_list + "/" + this.storeData.store_id,
      )
      .subscribe((data: any) => {
        if (data) {
          console.log(data);
          modal.close();
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            width: "350px", // customize width (default ~ 600px)
          }).then((result) => {
            if (result.isConfirmed) {
              console.log("User clicked OK");
              this.getTimesheetList();
            }
          });
        }
      });
  }


}
