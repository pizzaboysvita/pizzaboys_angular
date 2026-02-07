import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-suppliers.component.html',
  styleUrls: ['./add-suppliers.component.scss']
})
export class AddSupplierComponent implements OnInit {

  @Input() editData: any = null;
  @Input() type: 'Add' | 'Edit' | 'View' = 'Add';

  addSupplierForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.addSupplierForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      status: [1, Validators.required],
      items: this.fb.array([])
    });

    if (this.type === 'Edit' || this.type === 'View') {
      this.patchEditData();
      if (this.type === 'View') {
        this.addSupplierForm.disable();
      }
    } else {
      // ✅ default one item row
      this.addItem();
    }
  }

  get f() {
    return this.addSupplierForm.controls;
  }

  get items(): FormArray {
    return this.addSupplierForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      item_name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      date: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
          )
        ]
      ]
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
    this.addSupplierForm.patchValue(supplier);

    if (items && Array.isArray(items)) {
      items.forEach((item: any) => {
        this.items.push(
          this.fb.group({
            item_name: [item.item_name, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            date: [item.date, Validators.required]
          })
        );
      });
    }
  }

  formatDate(event: any, index: number): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);

    this.items.at(index).get('date')?.setValue(value, { emitEvent: false });
  }

  save(): void {
    if (this.addSupplierForm.invalid) {
      this.addSupplierForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.activeModal.close(this.addSupplierForm.value);
    this.isSubmitting = false;
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
