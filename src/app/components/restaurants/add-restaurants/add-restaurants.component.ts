import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWorkingHourComponent } from '../widgets/add-working-hour/add-working-hour.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { AppConstants } from '../../../app.constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
@Component({
  selector: 'app-add-restaurants',
  imports: [CardComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './add-restaurants.component.html',
  styleUrl: './add-restaurants.component.scss'
})
export class AddRestaurantsComponent {
  workinghours: any;
 constructor(public modal: NgbModal,private fb: FormBuilder,private apis:ApisService,private router:Router,private session:SessionStorageService){ }
  storeForm!: FormGroup;

  addHour(){
     this.session.setsessionStorage('storeType','add')
  const modalRef = this.modal.open(AddWorkingHourComponent, {
    windowClass: 'theme-modal add-hours',
    centered: true,
    size: 'lg',
     backdrop: 'static'
  });

  modalRef.result.then((result) => {
    if (result) {
    console.log(result)
    this.workinghours=result
    }
  }).catch((error) => {
    console.log('Modal dismissed:', error);
  });
  }

    ngOnInit() {
    this.storeForm = this.fb.group({
      storeName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      status: ['1', Validators.required],
    });
  }
addStore() {
    if (this.storeForm.invalid) {
      console.log(this.storeForm.value);
        Object.keys(this.storeForm.controls).forEach(key => {
        this.storeForm.get(key)?.markAsTouched();
      });
    } else {
    
      const reqbody={
  "store_name": this.storeForm.value.storeName,
  "email": this.storeForm.value.email,
  "phone": this.storeForm.value.phoneNumber,
  "city": this.storeForm.value.city,
  "location": this.storeForm.value.address,
  "image": "https://example.com/nz-store.jpg",
  "status": this.storeForm.value.status ,
  "street_address": this.storeForm.value.address,
  "password_hash": this.storeForm.value.password,
  "state": this.storeForm.value.state,
  "country":this.storeForm.value.country,
  "working_hours":JSON.stringify(this.workinghours)
}
console.log(reqbody)
this.apis.postApi(AppConstants.api_end_points.add_store,reqbody).subscribe((data:any)=>{
  console.log(data)
  if(data.success ==1){
     Swal.fire('Success!',data.message, 'success').then(
      (result) => {
  if (result) {
    console.log('User clicked OK');
    this.router.navigate(['/restaurants/restaurants-list'])
  
  }}
     );
  }
})

    }
  }

}
