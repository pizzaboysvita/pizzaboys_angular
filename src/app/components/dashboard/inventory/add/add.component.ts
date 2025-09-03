import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  inventoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.inventoryForm = this.fb.group({
      itemname: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      status: ['Active', Validators.required]
    });
  }

  save() {
    if (this.inventoryForm.valid) {
      this.activeModal.close(this.inventoryForm.value);
    } else {
      this.inventoryForm.markAllAsTouched();
    }
  }
}
