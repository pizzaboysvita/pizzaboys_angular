import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { AppConstants } from '../../../app.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-admin-media',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-admin-media.component.html',
  styleUrl: './add-admin-media.component.scss'
})
export class AddAdminMediaComponent {

  @Input() editData: any = null;   // ✅ For editing
  @Input() type: any;   // ✅ For editing
  addMediaForm!: FormGroup;
  isSubmitting = false;
  storesList: any
  private token = 'YOUR_JWT_TOKEN'; 
  payload: any;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private apiService: ApisService, private sessionStorage: SessionStorageService, public modal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.storeList();

    this.addMediaForm = this.fb.group({
      store_id: ['', Validators.required],
      text: ['', Validators.required],
      image: [null, Validators.required],
      video: [null, Validators.required],
      status: [true]
    });

if (this.type === 'Edit') {
  this.addMediaForm.patchValue({
    store_id: this.editData.store_id,
    text: this.editData.text,
    status: this.editData.status === 1
  });

  this.addMediaForm.get('image')?.clearValidators();
  this.addMediaForm.get('video')?.clearValidators();
  this.addMediaForm.get('image')?.updateValueAndValidity();
  this.addMediaForm.get('video')?.updateValueAndValidity();
}
  }


  get f() {
    return this.addMediaForm.controls;
  }
  storeList() {
    this.apiService
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data: any) => {
        if (data) {
          console.log(data);
          data.unshift({ store_id: '', store_name: 'All Stores' })
          this.storesList = data;
        }
      });

  }
 save() {
  if (this.addMediaForm.invalid) {
    this.addMediaForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  const formData = new FormData();

  formData.append('store_id', this.addMediaForm.value.store_id);
  formData.append('text', this.addMediaForm.value.text);
  formData.append('status', this.addMediaForm.value.status ? '1' : '0');

  // Only append files if user selected them
  if (this.addMediaForm.value.image instanceof File) {
    formData.append('image', this.addMediaForm.value.image);
  }

  if (this.addMediaForm.value.video instanceof File) {
    formData.append('video', this.addMediaForm.value.video);
  }

  formData.append(
    'created_by',
    JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id
  );

  if (this.type === 'Edit') {
    formData.append('type', 'update');
    formData.append('media_id', this.editData.media_id);
  } else {
    formData.append('type', 'insert');
  }

  this.apiService
    .postApi(AppConstants.api_end_points.inventory, formData)
    .subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        if (res.code === "1") {
          Swal.fire("Success!", res.message, "success").then(() => {
            this.modal.dismissAll();
          });
        } else {
          Swal.fire("Error", res.message || "Failed to save media", "error");
        }
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire("Error", "Server error. Please try again.", "error");
      }
    });
}




  cancel() {
    this.activeModal.dismiss('cancel');
  }
  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.addMediaForm.patchValue({ image: file });
      this.addMediaForm.get('image')?.markAsTouched();
    }
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.addMediaForm.patchValue({ video: file });
      this.addMediaForm.get('video')?.markAsTouched();
    }
  }
}
