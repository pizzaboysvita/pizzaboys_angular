import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../services/service.service';
import { ApisService } from '../../../shared/services/apis.service';
import { AppConstants } from '../../../app.constants';
import { SessionStorageService } from '../../../shared/services/session-storage.service';

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
    private inventoryService: ApisService,private sessionStorage: SessionStorageService
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
  "type": "update",
  item_id:this.editData.item_id,
  "item_name": this.inventoryForm.value.item_name,
  "quantity": this.inventoryForm.value.quantity,
  "unit": this.inventoryForm.value.unit,
  "item_state": 'F',
  "imported_from": this.inventoryForm.value.imported_from,
  "created_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
}


      this.inventoryService.postApi(AppConstants.api_end_points.inventory, payload).subscribe({
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
  "type": "insert",
  "item_name": this.inventoryForm.value.item_name,
  "quantity": this.inventoryForm.value.quantity,
  "unit": this.inventoryForm.value.unit,
  "item_state": 'F',
  "imported_from": this.inventoryForm.value.imported_from,
  "created_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
}


     this.inventoryService.postApi(AppConstants.api_end_points.inventory, payload).subscribe({
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
