import { Component, ViewChild } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountComponent } from '../../users/add-new-users/account/account.component';
import { PermissionComponent } from '../../users/add-new-users/permission/permission.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  constructor(private fb: FormBuilder) {}

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
    if (isValid) {
      // Do parent-level logic here (e.g., send to backend)
      console.log('Account form is valid. Proceeding...');
    } else {
      console.log('Account form has errors.');
    }
  }

}
