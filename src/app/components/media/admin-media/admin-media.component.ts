import { Component, ViewChild } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
import { AgGridAngular } from "@ag-grid-community/angular";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ColDef, GridOptions } from "@ag-grid-community/core";
import { AddAdminMediaComponent } from "../add-admin-media/add-admin-media.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";

@Component({
  selector: "app-admin-media",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    AgGridAngular,
    CardComponent,
    NgSelectModule,
  ],
  templateUrl: "./admin-media.component.html",
  styleUrl: "./admin-media.component.scss",
})
export class AdminMediaComponent {
  adminMediaForm!: FormGroup;

  storesList: any[] = [];
  staff_list: any[] = [];
  mediaListBackup: any[] = [];
  selectedItem: any;

  @ViewChild("confirmModal") confirmModal!: any;

  gridOptions: GridOptions = {
    rowHeight: 80,
  };

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    unSortIcon: true,
    suppressMenu: true,
  };

  tableConfig: ColDef[] = [
    {
      headerName: "Store ID",
      field: "store_id",
    },
    {
      headerName: "Text",
      field: "text",
      tooltipField: "text",
    },
    {
      headerName: "Image Banner",
      field: "image",
      sortable: false,
      cellRenderer: (params: any) =>
        params.value ? `<img src="${params.value}" class="media-img" />` : "-",
    },
    {
      headerName: "Video",
      field: "video",
      sortable: false,
      cellRenderer: (params: any) =>
        params.value
          ? `<video class="media-video" controls>
               <source src="${params.value}" type="video/mp4">
             </video>`
          : "-",
    },
    {
      headerName: "Actions",
      minWidth: 150,
      cellRenderer: () => `
        <div style="display:flex;align-items:center;gap:15px">
          <button class="btn btn-sm p-0" data-action="edit">
            <span class="material-symbols-outlined text-success">edit</span>
          </button>
          <button class="btn btn-sm p-0" data-action="delete">
            <span class="material-symbols-outlined text-danger">delete</span>
          </button>
        </div>
      `,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private apis: ApisService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStores();
    this.loadInventory();
  }

  // ✅ Initialize Form
  initForm() {
    this.adminMediaForm = this.fb.group({
      store_id: [-1, Validators.required],
    });
  }

  // ✅ Load Stores Dynamically
  loadStores() {
    this.apis
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data: any) => {
        if (data) {
          this.storesList = [
            { store_id: -1, store_name: "All Stores" }, // Important
            ...data,
          ];
        }
      });
  }

  // ✅ Load All Banners
  loadInventory() {
    this.apis.getBanners(-1).subscribe({
      next: (res: any) => {
        if (res?.code === "1") {
          this.staff_list = res.banners.map((banner: any) => ({
            id: banner.id,
            store_id: banner.store_id,
            text: banner.banner_text,
            image: banner.banner_image_url,
            video: banner.banner_video_url,
            start_date: banner.start_date,
            end_date: banner.end_date,
            status: banner.status,
          }));

          this.mediaListBackup = [...this.staff_list];
        }
      },
      error: (err) => {
        console.error("Banner fetch error", err);
      },
    });
  }

  // ✅ Search (Frontend Filtering)
  search() {
    const storeId = this.adminMediaForm.value.store_id;

    if (storeId === -1) {
      this.staff_list = [...this.mediaListBackup];
      return;
    }

    this.staff_list = this.mediaListBackup.filter(
      (item: any) => item.store_id === storeId,
    );
  }

  // ✅ Reset
  reset() {
    this.adminMediaForm.patchValue({ store_id: -1 });
    this.staff_list = [...this.mediaListBackup];
  }

  // ✅ Add New
  openNew() {
    const modalRef = this.modalService.open(AddAdminMediaComponent, {
      centered: true,
      backdrop: "static",
      size: "md",
    });

    modalRef.componentInstance.type = "Add";
    modalRef.componentInstance.editData = null;

    modalRef.result.finally(() => {
      this.loadInventory();
    });
  }

  // ✅ Edit
  editRow(row: any) {
    const modalRef = this.modalService.open(AddAdminMediaComponent, {
      centered: true,
      backdrop: "static",
      size: "md",
    });

    modalRef.componentInstance.type = "Edit";
    modalRef.componentInstance.editData = row;

    modalRef.result.finally(() => {
      this.loadInventory();
    });
  }

  // ✅ Grid Actions
  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    while (target && !target.dataset?.["action"] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }

    const action = target?.getAttribute("data-action");

    if (action === "edit") {
      this.editRow(event.data);
    } else if (action === "delete") {
      this.selectedItem = event.data;
      this.modalService.open(this.confirmModal, {
        centered: true,
        backdrop: "static",
      });
    }
  }

  // ✅ Confirm Delete (API can be added here)
  onConfirm(modal: any) {
    console.log("Delete:", this.selectedItem);
    modal.close();
  }
}
