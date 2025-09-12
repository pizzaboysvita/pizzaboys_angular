import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../services/service.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @Input() editData: any = null;   // ✅ For editing
  inventoryForm!: FormGroup;
  isSubmitting = false;

  private token = 'YOUR_JWT_TOKEN'; // Replace with your real token from auth

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      item_name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: ['kg', Validators.required],
      item_state: ['D', Validators.required], // Draft / Final
      imported_from: ['Local Supplier', Validators.required],
      created_by: [101, Validators.required]
    });

    if (this.editData) {
      this.inventoryForm.patchValue(this.editData);
    }
  }

  get f() {
    return this.inventoryForm.controls;
  }

  save() {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.editData) {
      const payload = {
        type: 'update',
        item_id: this.editData.item_id,
        ...this.inventoryForm.value,
        updated_by: 102 // Example user ID
      };

      this.inventoryService.addInventory(payload, this.token).subscribe({
        next: (res) => {
          console.log('Inventory updated:', res);
          this.isSubmitting = false;
          this.activeModal.close(res);
        },
        error: (err) => {
          console.error('Error updating item:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      const payload = {
        type: 'insert',
        ...this.inventoryForm.value
      };

      this.inventoryService.addInventory(payload, this.token).subscribe({
        next: (res) => {
          console.log('Inventory added:', res);
          this.isSubmitting = false;
          this.activeModal.close(res);
        },
        error: (err) => {
          console.error('Error adding item:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }
}
