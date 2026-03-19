import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
  selector: "app-add-supplier",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: "./add-suppliers.component.html",
  styleUrls: ["./add-suppliers.component.scss"],
})
export class AddSuppliersComponent implements OnInit {
  @Input() editData: any = null;
  @Input() type: "Add" | "Edit" | "View" = "Add";

  addSupplierForm!: FormGroup;
  isSubmitting = false;
  rowData: any;
  storesList: any;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public modal: NgbModal,
    private apis: ApisService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.addSupplierForm = this.fb.group({
      supplier_name: ["", Validators.required],
      email_id: ["", [Validators.required, Validators.email]],
      phone_number: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      address: ["", Validators.required],
      status: [1, Validators.required],
      items: this.fb.array([]),
      office_number: ["", Validators.required],
      contact_person: ["", Validators.required],
      gst_number: ["", Validators.required],
      notes: ["", Validators.required],
    });

    this.loadInventory();
    this.storeList();

    if (this.type === "Edit" || this.type === "View") {
      this.patchEditData();
    }

    if (this.type === "Add") {
      this.addItem();
    }

   if (this.type === "View") {
  this.addSupplierForm.disable({ emitEvent: false });

 
  this.items.controls.forEach((group: any) => {
    group.enable({ emitEvent: false }); 
    group.get('quantity')?.disable();
    group.get('units')?.disable();
  });
}
  }

  get f() {
    return this.addSupplierForm.controls;
  }

  get items(): FormArray {
    return this.addSupplierForm.get("items") as FormArray;
  }

  loadInventory(): void {
    this.apis.getApi(AppConstants.api_end_points.inventory).subscribe({
      next: (res: any) => {
        this.rowData = res.data || res;
        console.log("Inventory loaded:", this.rowData);
      },
      error: (err) => {
        console.error("Error loading inventory:", err);
        Swal.fire("Error", "Failed to load inventory", "error");
      },
    });
  }
  storeList() {
    this.apis
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data) => {
        if (data) {
          this.storesList = data;
          console.log("Store list loaded:", this.storesList);
        }
      });
  }
  onItemChange(selected: any, index: number) {
    if (!selected) return;

    const itemGroup = this.items.at(index);

    itemGroup.patchValue({
      item_id: selected.item_id,
      store_id: selected.store_id,
      quantity: Number(selected.quantity) || 0,
      units: selected.unit || "",
       price: selected.price || 0
    });
  }
  createItem(): FormGroup {
    return this.fb.group({
      store_id: ["", Validators.required],
      item_id: ["", Validators.required],
      quantity: [{ value: 0, disabled: true }, Validators.required],
      units: [{ value: "", disabled: true }, Validators.required],
      price: ["", [Validators.required, Validators.min(0)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  deleteItem(index: number): void {
    this.items.removeAt(index);
  }

  patchEditData(): void {
    if (!this.editData) return;

    const { items, ...supplier } = this.editData;

    
    this.addSupplierForm.patchValue({
      supplier_name: supplier.supplier_name,
      email_id: supplier.email_id,
      phone_number: supplier.phone_number,
      address: supplier.address,
      status: supplier.status,
      office_number: supplier.office_number,
      contact_person: supplier.contact_person,
      gst_number: supplier.gst_number,
      notes: supplier.notes,
    });

    
    this.items.clear();

    if (items && items.length > 0) {
      items.forEach((item: any) => {
        const group = this.createItem();

        group.patchValue({
          store_id: item.store_id,
          item_id: item.item_id,
          quantity: item.quantity,
          units: item.units,
         price: Number(item.price) || 0
        });

        this.items.push(group);
      });
    } else {
      this.addItem();
    }
  }

  formatDate(event: any, index: number): void {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);

    this.items.at(index).get("date")?.setValue(value, { emitEvent: false });
  }

  save(): void {
    if (this.addSupplierForm.invalid) {
      this.addSupplierForm.markAllAsTouched();
      return;
    }

    const formValue = this.addSupplierForm.getRawValue();
    const firstItem = formValue.items?.[0];

    if (!firstItem) {
      Swal.fire("Error", "Please select an item", "error");
      return;
    }

    const req_body: any = {
      action: this.type === "Edit" ? "UPDATE" : "INSERT",
      supplier_id: this.type === "Edit" ? this.editData?.supplier_id : null,
      supplier_name: formValue.supplier_name?.trim(),
      office_number: formValue.office_number?.trim(),
      contact_person: formValue.contact_person?.trim(),
      phone_number: formValue.phone_number?.trim(),
      email_id: formValue.email_id?.trim(),
      address: formValue.address?.trim(),
      gst_number: formValue.gst_number?.trim(),
      status: formValue.status ? 1 : 0,
      notes: formValue.notes?.trim(),

      store_id: firstItem.store_id,
      item_id: firstItem.item_id,
      quantity: firstItem.quantity,
      units: firstItem.units,
      price: firstItem.price,

      created_by: this.type === "Add" ? 1001 : null,
      updated_by: this.type === "Edit" ? 1001 : null,
    };

    console.log("Request Body:", req_body);
    console.log("GST number", formValue.gst_number);

    this.isSubmitting = true;

    this.apis
      .postApi(AppConstants.api_end_points.suppliers, req_body)
      .subscribe({
        next: (data: any) => {
          if (data.code == 1) {
            Swal.fire("Success!", data.message, "success").then(() => {
              this.activeModal.close(true);
            });
          }
        },
        error: () => {
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }
  cancel(): void {
    this.activeModal.dismiss("cancel");
  }
}
