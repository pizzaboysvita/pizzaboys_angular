import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NavService } from '../../../services/nav.service';
import { CustomizerComponent } from '../../customizer/customizer.component';
import { SessionStorageService } from '../../../services/session-storage.service';
import { ApisService } from '../../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [HeaderComponent, SidebarComponent, FooterComponent,
        RouterModule, CustomizerComponent,CommonModule]
})

export class ContentComponent {
  users:any
    pos: string | null;
    constructor(public navService: NavService,private sessionDetails:SessionStorageService,private apis:ApisService) {
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
ngOnInit(){
    this.pos=this.sessionDetails.getsessionStorage('Pos')
    this.apis.poschanges$.subscribe((data:any)=>{
        console.log(data,this.sessionDetails.getsessionStorage('Pos'))
    })
}
    onResize() {
        if (window.innerWidth < 1185) {
            this.navService.collapseSidebar = true;
        } else {
            this.navService.collapseSidebar = false;
        }
    }

}
