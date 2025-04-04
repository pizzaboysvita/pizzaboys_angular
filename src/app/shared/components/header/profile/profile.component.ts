import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from "../../feather-icons/feather-icons.component";
import { LoggingOutComponent } from '../../widgets/logging-out/logging-out.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [FeatherIconsComponent, RouterModule]
})

export class ProfileComponent {

    constructor(public modal: NgbModal) { }

    logOut() {
        this.modal.open(LoggingOutComponent,{
            windowClass:'theme-modal',centered:true
        })
    }

}
