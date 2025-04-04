import { Component } from '@angular/core';
import { Permission } from '../../../../shared/data/users';

@Component({
    selector: 'app-permission',
    imports: [],
    templateUrl: './permission.component.html',
    styleUrl: './permission.component.scss'
})

export class PermissionComponent {

  public Permission = Permission ;

}
