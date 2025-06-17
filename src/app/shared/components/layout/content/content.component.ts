import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NavService } from '../../../services/nav.service';
import { CustomizerComponent } from '../../customizer/customizer.component';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [HeaderComponent, SidebarComponent, FooterComponent,
        RouterModule, CustomizerComponent]
})

export class ContentComponent {
  users:any
    constructor(public navService: NavService,private sessionDetails:SessionStorageService) {
        if (window.innerWidth < 1185) {
            navService.collapseSidebar = true;
        }
        const userData = this.sessionDetails.getsessionStorage('loginDetails');
        if (userData !== null) {
          this.users = JSON.parse(userData);
          console.log(this.users,"No user data found in localStorage.");

        } else {
          console.log("No user data found in localStorage.");
        }
        
    }


    @HostListener('window:resize', ['$event'])

    onResize() {
        if (window.innerWidth < 1185) {
            this.navService.collapseSidebar = true;
        } else {
            this.navService.collapseSidebar = false;
        }
    }

}
