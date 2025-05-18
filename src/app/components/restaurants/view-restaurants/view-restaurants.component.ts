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

@Component({
  selector: 'app-view-restaurants',
  imports:  [CardComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './view-restaurants.component.html',
  styleUrl: './view-restaurants.component.scss'
})
export class ViewRestaurantsComponent {

 storeForm!: FormGroup;
  workinghours: any;
  storeData: any;
 constructor(public modal: NgbModal,private fb: FormBuilder,private apis:ApisService,private router:Router,public session:SessionStorageService){ }
 


  addHour(){
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
     this.storeData=JSON.parse(this.session.getsessionStorage('storeDetails') as any)
      console.log(this.storeData)
    this.storeForm = this.fb.group({
      storeName: ['', Validators.required],
      email: ['', [Validators.required, Validators?.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      status: ['Active', Validators.required],
    });
     if(this.session.getsessionStorage('storeType') =='view'){
    this.storeForm.disable()
     }
this.viewDetails(this.storeData)
  }
viewDetails(details:any){
  this.storeForm.patchValue({
      storeName: details.store_name,
      email:details.email,
      phoneNumber: details.phone,
      password: '',
      address: details.street_address,
      city: details.city,
      state: details.state,
      postalCode: details.store_name,
      country: details.country,
      status:details.status,
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
          "store_id": this.storeData.store_id,
    "store_name": this.storeForm.value.storeName,
    "email": this.storeForm.value.email,
    "phone": this.storeForm.value.phoneNumber,
    "city": this.storeForm.value.city,
    "location": this.storeForm.value.address,
    "image": "https://example.com/nz-store.jpg",
    "status": this.storeForm.value.status =='Active'?1:this.storeForm.value.status =='Inactive'?0:'' ,
    "street_address": this.storeForm.value.address,
    "password_hash": this.storeForm.value.password,
    "state": this.storeForm.value.state,
    "country":this.storeForm.value.country,
    "working_hours": this.workinghours
  }
  console.log(reqbody)
  this.apis.putApi(AppConstants.api_end_points.add_store,reqbody).subscribe((data:any)=>{
    console.log(data)
    if(data){
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
