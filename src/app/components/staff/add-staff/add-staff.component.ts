import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-staff',
  imports: [CardComponent,NgSelectModule],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.scss'
})
export class AddStaffComponent {
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
