import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountComponent } from '../../users/add-new-users/account/account.component';
import { PermissionComponent } from '../../users/add-new-users/permission/permission.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-staff',
  imports: [NgbNavModule, PermissionComponent, AccountComponent, CardComponent],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.scss'
})
export class AddStaffComponent {
    public active = 1;
  public ProductPlaceholder = [
    { id: 1, name: 'Static Menu' },
    { id: 2, name: 'Simple' },
    { id: 3, name: 'Classified' },
  ]
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
}
