import { CommonModule } from "@angular/common";
import {
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ColDef, GridOptions, CellClickedEvent } from "@ag-grid-community/core";
import { NgbModal, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CardComponent } from "../../../shared/components/card/card.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { AddSuppliersComponent } from "../add-suppliers/add-suppliers.component";
import { ApisService } from "../../../shared/services/apis.service";
import { AppComponent } from "../../../app.component";
import { AppConstants } from "../../../app.constants";
import Swal from "sweetalert2";
@Component({
  selector: "app-suppliers",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    NgbDropdownModule,
    CardComponent,
    NgSelectModule,
  ],
  templateUrl: "./suppliers.component.html",
  styleUrl: "./suppliers.component.scss",
})
export class SuppliersComponent {
  @ViewChild("confirmModal") confirmModalRef!: TemplateRef<any>;
  suppliersForm!: FormGroup;

  supplierList: any[] = [];
  supplierData: any;
  supplierDataBackup: any[] = [];

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
      headerName: "S.No",
      valueGetter: (params) => (params.node?.rowIndex ?? -1) + 1,
      maxWidth: 80,
    },

    {
      headerName: "Supplier Name",
      field: "supplier_name",
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: "Email",
      field: "email_id",
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: "Provider",
      field: "contact_person",
      sortable: true,
      unSortIcon: true,
      suppressMenu: true,
    },
    {
      headerName: "Address",
      field: "address",
      sortable: true,
      tooltipField: "address",
      unSortIcon: true,
      suppressMenu: true,
    },
    // {
    //   headerName: 'Item',
    //   field: 'item',
    //   sortable: true,
    //   unSortIcon: true,
    //   suppressMenu: true,
    // },
    {
      headerName: "Actions",
      minWidth: 150,
      cellRenderer: () => `
     <div style="display:flex;align-items:center;gap:15px">
        <button class="btn btn-sm p-0" data-action="view">
          <span class="material-symbols-outlined text-warning">visibility</span>
        </button>
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
  itemList: readonly any[] | null | undefined;
  clientList: readonly any[] | null | undefined;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private apis: ApisService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
    this.loadSupplierData();
  }

  initForm() {
    this.suppliersForm = this.fb.group({
      supplier_name: [-1, Validators.required],
    });
  }

  loadSuppliers() {
    this.supplierList = [
      { supplier_id: -1, supplier_name: "All Suppliers" },
      { supplier_id: 201, supplier_name: "ABC Traders" },
      { supplier_id: 202, supplier_name: "Fresh Farms Ltd" },
    ];
  }

  loadSupplierData() {
    // this.supplierData = [
    //   {
    //     supplier_id: 201,
    //     supplier_name: 'John Doe',
    //     email: 'john@mail.com',
    //     provider: 'ABC Traders',
    //     address: 'Chennai, Tamil Nadu',
    //     item: 'Vegetables'
    //   },
    //   {
    //     supplier_id: 202,
    //     supplier_name: 'Ravi Kumar',
    //     email: 'ravi@mail.com',
    //     provider: 'Fresh Farms Ltd',
    //     address: 'Bangalore, Karnataka',
    //     item: 'Fruits'
    //   }
    // ];

    // this.supplierDataBackup = [...this.supplierData];

    this.apis
      .getApi(AppConstants.api_end_points.suppliers)
      .subscribe((data: any) => {
        if (data) {
          data.data.forEach((element: any) => {
            element.status =
              element.status == 1
                ? "Active"
                : element.status == 0
                  ? "Inactive"
                  : element.status == 2
                    ? "Pending"
                    : "";

            console.log("Suppliers List", data);
          });

          ((this.supplierData = data.data),
            (this.supplierDataBackup = data.data));
        }
      });
  }

  delete(data: any) {
    this.supplierData = data;
    this.openConfirmPopup();
  }

  openConfirmPopup() {
    this.modalService.open(this.confirmModalRef, {
      centered: true,
      backdrop: "static",
    });
  }
  onConfirm(modal: any) {
    const req_body = {
      action: "DELETE",
      supplier_id: this.selectedItem.supplier_id,
    };

    console.log("Selected Item:", this.selectedItem);

    this.apis
      .postApi(AppConstants.api_end_points.suppliers, req_body)
      .subscribe((data: any) => {
        if (data) {
          modal.close();

          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            width: "350px",
          }).then(() => {
            this.loadSupplierData(); 
          });
        }
      });
  }
  search() {
    const { supplier_name } = this.suppliersForm.value;

    this.supplierData = this.supplierDataBackup.filter((item) => {
      const supplierMatch =
        supplier_name === -1 || item.supplier_id === supplier_name;

      return supplierMatch;
    });
  }

  reset() {
    this.suppliersForm.patchValue({
      supplier_name: -1,
    });

    this.supplierData = [...this.supplierDataBackup];
  }

  openNew() {
    const modalRef = this.modalService.open(AddSuppliersComponent, {
      centered: true,
      backdrop: "static",
      size: "l",
    });

    modalRef.componentInstance.type = "Add";

    modalRef.result.then((res) => {
      if (res) {
        this.loadSupplierData();
      }
    });
  }

  onCellClicked(event: CellClickedEvent) {
    let target = event.event?.target as HTMLElement;

    while (target && !target.dataset?.["action"] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }

    const action = target?.getAttribute("data-action");

    if (action === "delete") {
      this.selectedItem = event.data;

      this.modalService.open(this.confirmModal, {
        centered: true,
        backdrop: "static",
      });
    } else if (action === "view") {
      this.openViewEdit(event.data, "View");
    } else if (action === "edit") {
      this.openViewEdit(event.data, "Edit");
    }
  }
  openViewEdit(data: any, mode: "Add" | "Edit" | "View") {
    const modalRef = this.modalService.open(AddSuppliersComponent, {
      centered: true,
      backdrop: "static",
      size: "lg",
    });

    modalRef.componentInstance.type = mode;
    modalRef.componentInstance.editData = data;

    if (mode === "Edit") {
      modalRef.result.then((res) => {
        if (res) {
          this.loadSupplierData();
        }
      });
    }
  }
}
