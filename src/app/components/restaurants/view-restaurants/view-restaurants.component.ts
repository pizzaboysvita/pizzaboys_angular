import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWorkingHourComponent } from '../widgets/add-working-hour/add-working-hour.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { ApisService } from '../../../shared/services/apis.service';
import { AppConstants } from '../../../app.constants';
import Swal from 'sweetalert2';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-view-restaurants',
  imports: [CardComponent, ReactiveFormsModule, CommonModule,NgxMaskDirective],
  templateUrl: './view-restaurants.component.html',
  styleUrl: './view-restaurants.component.scss',
    providers:[NgxMaskPipe]
})
export class ViewRestaurantsComponent {

  storeForm!: FormGroup;
  workinghours: any;
  storeData: any;
  uploadImagUrl: string | ArrayBuffer | null;
  file: File;
  uploadImagUrl_data: any;
  constructor(public modal: NgbModal, private fb: FormBuilder, private apis: ApisService, private router: Router, public session: SessionStorageService) { }



  addHour() {
    const modalRef = this.modal.open(AddWorkingHourComponent, {
      windowClass: 'theme-modal add-hours',
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.result.then((result) => {
      if (result) {
        console.log(result)
        this.workinghours = result
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  ngOnInit() {
    this.storeData = JSON.parse(this.session.getsessionStorage('storeDetails') as any)
    console.log(this.storeData)
    this.storeForm = this.fb.group({
      storeName: ['', Validators.required],
      email: ['', [Validators.required, Validators?.email]],
      phoneNumber: ['', [Validators.required]],
      password: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      status: ['Active', Validators.required],
    });
    if (this.session.getsessionStorage('storeType') == 'view') {
      this.storeForm.disable()
    }
    this.viewDetails(this.storeData)
  }
  viewDetails(details: any) {
    this.storeForm.patchValue({
      storeName: details.store_name,
      email: details.email,
      phoneNumber: details.phone,
      password: '',
      address: details.street_address,
      city: details.city,
      state: details.state,
      postalCode: details.store_name,
      country: details.country,
      status: details.status,
    });
    this.uploadImagUrl_data = details.image
    this.workinghours = JSON.parse(details.working_hours)
  }
  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      console.log(input.files[0])
      this.file = input.files[0];
      this.uploadImagUrl_data=this.file
      console.log()
      const reader = new FileReader();

      reader.onload = () => {
        this.uploadImagUrl_data = reader.result; // this will update the image source
      };

      reader.readAsDataURL(this.file); // convert image to base64 URL
    }
  }

  addStore() {
    if (this.storeForm.invalid) {
      console.log(this.storeForm.value);
      Object.keys(this.storeForm.controls).forEach(key => {
        this.storeForm.get(key)?.markAsTouched();
      });
    } else {
      let reqbody: any = {
  type: "update",
  store_id: this.storeData.store_id,
  store_name: this.storeForm.value.storeName,
  email: this.storeForm.value.email,
  phone: this.storeForm.value.phoneNumber,
  city: this.storeForm.value.city,
  location: this.storeForm.value.address,
  image: this.uploadImagUrl_data,
  status:
    this.storeForm.value.status === "Active"
      ? 1
      : this.storeForm.value.status === "Inactive"
      ? 0
      : "",
  street_address: this.storeForm.value.address,
  state: this.storeForm.value.state,
  country: this.storeForm.value.country,
  zip_code: "94406",
  working_hours: this.workinghours,
  created_by: 1,
  updated_by: 1,
};

// ✅ Add password_hash only if provided
if (this.storeForm.value.password?.trim()) {
  reqbody.password_hash = this.storeForm.value.password;
}

console.log(reqbody);

      const formData = new FormData();

      formData.append('image', this.file ? this.file : ''); // Attach Blob with a filename
      formData.append('body', JSON.stringify(reqbody));
      this.apis.postApi(AppConstants.api_end_points.store_list, formData).subscribe((data: any) => {
        console.log(data)
        if (data) {
          Swal.fire('Success!', data.message, 'success').then(
            (result) => {
              if (result) {
                console.log('User clicked OK');
                this.router.navigate(['/restaurants/restaurants-list'])

              }
            }
          );
        }
      })

    }
  }
  goBack() {
    console.log('Going back to restaurant list');
    this.router.navigate(['/restaurants/restaurants-list']);
  }
  removeImage(){
        this.uploadImagUrl_data = null;
  }
   allowOnlyAlphabets(event: KeyboardEvent) {
    const char = event.key;
    const regex = /^[A-Za-z\s-]+$/;

    if (!regex.test(char)) {
      event.preventDefault();
    }
  }
    capitalizeWords_firstName(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    this.storeForm.patchValue({
      storeName: input.value,
    });
  }
}
