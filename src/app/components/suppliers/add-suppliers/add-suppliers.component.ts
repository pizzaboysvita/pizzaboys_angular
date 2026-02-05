import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ) { }

  ngOnInit(): void {
    this.addSupplierForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      item_name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      status: [1, Validators.required],
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

    if (this.type === 'Edit') {
      this.addSupplierForm.patchValue(this.editData);
    }
    else if (this.type === 'View') {
      this.addSupplierForm.patchValue(this.editData);
      this.addSupplierForm.disable();
    }
    else {
      this.addSupplierForm.reset();
      this.addSupplierForm.get('status')?.setValue(true);
    }
  }

  get f() {
    return this.addSupplierForm.controls;
  }
  formatDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }

    this.addSupplierForm.get('date')?.setValue(value, { emitEvent: false });
  }
  save() {
    if (this.addSupplierForm.invalid) {
      this.addSupplierForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = this.addSupplierForm.value;
    console.log('Supplier Data:', formData);

    this.activeModal.close(formData);
    this.isSubmitting = false;
  }
  cancel() {
    this.activeModal.dismiss('cancel');
  }
}
