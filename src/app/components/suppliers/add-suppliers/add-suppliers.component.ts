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

@Component({
  selector: "app-add-supplier",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add-suppliers.component.html",
  styleUrls: ["./add-suppliers.component.scss"],
})
export class AddSuppliersComponent implements OnInit {
  @Input() editData: any = null;
  @Input() type: "Add" | "Edit" | "View" = "Add";

  addSupplierForm!: FormGroup;
  isSubmitting = false;

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
      // items: this.fb.array([]),
      office_number: ["", Validators.required],
      contact_person: ["", Validators.required],
      gst_number: ["", Validators.required],
      notes: ["", Validators.required],
    });

   if (this.type === "Edit" || this.type === "View") {
    this.patchEditData();
  }

  if (this.type === "View") {
    this.addSupplierForm.disable();
  }

  if (this.type === "Add") {
    this.addItem();
  }
  }

  get f() {
    return this.addSupplierForm.controls;
  }

  get items(): FormArray {
    return this.addSupplierForm.get("items") as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      item_name: ["", Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      date: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
          ),
        ],
      ],
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

  console.log("Edit Data:", this.editData); 

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

  
  if (items && Array.isArray(items)) {
    items.forEach((item: any) => {
      this.items.push(
        this.fb.group({
          item_name: [item.item_name, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          date: [item.date, Validators.required],
        })
      );
    });
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

  const formValue = this.addSupplierForm.value;
  let req_body: any;

  
  if (this.type === "Edit") {
    req_body = {
      action: "UPDATE",
      supplier_id: this.editData?.supplier_id,
      supplier_name: formValue.supplier_name,
      office_number: formValue.office_number,
      contact_person: formValue.contact_person,
      phone_number: formValue.phone_number,
      email_id: formValue.email_id,
      address: formValue.address,
      gst_number: formValue.gst_number,
      status: formValue.status ? 1 : 0,
      notes: formValue.notes,
      created_by: null,
      updated_by: 1,
    };
  } else {
    req_body = {
      action: "INSERT",
      supplier_id: null,
      supplier_name: formValue.supplier_name,
      office_number: formValue.office_number,
      contact_person: formValue.contact_person,
      phone_number: formValue.phone_number,
      email_id: formValue.email_id,
      address: formValue.address,
      gst_number: formValue.gst_number,
      status: formValue.status ? 1 : 0,
      notes: formValue.notes,
      created_by: 1,
      updated_by: null,
    };
  }

  console.log(req_body);
 

  this.isSubmitting = true;

  this.apis.postApi(AppConstants.api_end_points.suppliers, req_body)
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
