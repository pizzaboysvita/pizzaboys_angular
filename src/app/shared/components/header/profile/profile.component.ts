import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from "../../feather-icons/feather-icons.component";
import { LoggingOutComponent } from '../../widgets/logging-out/logging-out.component';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [FeatherIconsComponent, RouterModule]
})

export class ProfileComponent {
    userDetails: any;

    constructor(public modal: NgbModal,private sessionStorageService:SessionStorageService) { 
         this.userDetails = JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user;
console.log(this.userDetails, 'userDetails')
    }

    logOut() {
        this.modal.open(LoggingOutComponent,{
            windowClass:'theme-modal',centered:true
        })
    }

}
