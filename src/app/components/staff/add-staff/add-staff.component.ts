import { Component, ViewChild } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountComponent } from '../../users/add-new-users/account/account.component';
import { PermissionComponent } from '../../users/add-new-users/permission/permission.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { AppConstants } from '../../../app.constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApisService } from '../../../shared/services/apis.service';

@Component({
  selector: 'app-add-staff',
  imports: [NgbNavModule, PermissionComponent, AccountComponent, CardComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.scss'
})
export class AddStaffComponent {
    public active = 1;
    staffForm!: FormGroup;
  public ProductPlaceholder = [
    { id: 1, name: 'Static Menu' },
    { id: 2, name: 'Simple' },
    { id: 3, name: 'Classified' },
  ]
  constructor(private fb: FormBuilder,private apis:ApisService,private router:Router) {}

  public createRoles=[
    {
        data: [
            {
                title: 'POS Management',
                subData: [
                    {
                        id: 'role1',
                        title: 'Orders'
                    },
                    {
                        id: 'role2',
                        title: 'Tracking'
                    },
                    {
                      id: 'role1',
                      title: 'Orders'
                  },
                  {
                      id: 'role2',
                      title: 'Tracking'
                  },
                   {
                        id: 'role1',
                        title: 'Orders'
                    },
                    {
                        id: 'role2',
                        title: 'Tracking'
                    },
                    {
                      id: 'role2',
                      title: 'Tracking'
                  },
                  {
                    id: 'role1',
                    title: 'Orders'
                },
                {
                    id: 'role2',
                    title: 'Tracking'
                },
                 {
                      id: 'role1',
                      title: 'Orders'
                  },
                  {
                      id: 'role2',
                      title: 'Tracking'
                  },
                  {
                    id: 'role2',
                    title: 'Tracking'
                },
                {
                  id: 'role1',
                  title: 'Orders'
              },
              {
                  id: 'role2',
                  title: 'Tracking'
              },
               {
                    id: 'role1',
                    title: 'Orders'
                },
                {
                    id: 'role2',
                    title: 'Tracking'
                },
                   
                ]
            },
           
          ]}
          ]
     ngOnInit(): void {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      permissions: this.fb.group({
        canEdit: [false],
        canDelete: [false],
        canView: [true],
      }),
    });
  }

    @ViewChild(AccountComponent) accountComponent!: AccountComponent;

  onSubmit() {
    const isValid = this.accountComponent.validateAndSubmit();
    this.accountComponent.accountForm.value
    console.log(isValid   ,this.accountComponent.accountForm.controls)
    if (isValid) {
 const req_body={
  "first_name":  this.accountComponent.accountForm.value.firstName,
  "last_name":   this.accountComponent.accountForm.value.lastName,
  "phone_number":   this.accountComponent.accountForm.value.phone,
  "email":   this.accountComponent.accountForm.value.email,
  "password_hash":  this.accountComponent.accountForm.value.password,
  "address":   this.accountComponent.accountForm.value.address,
  "country":   this.accountComponent.accountForm.value.country,
  "state":   this.accountComponent.accountForm.value.state,
  "city":  this.accountComponent.accountForm.value.city,
  "pos_pin":   this.accountComponent.accountForm.value.posPin,
}
this.apis.postApi(AppConstants.api_end_points.staff,req_body).subscribe((data:any)=>{
  if(data.code ==1){
    console.log(data)
      Swal.fire('Success!',data.message, 'success').then(
          (result) => {
      if (result) {
        console.log('User clicked OK');
        this.router.navigate(['/staff/staff-list'])
      
      }})
  }
})
    } else {
      
    }
  }

}
