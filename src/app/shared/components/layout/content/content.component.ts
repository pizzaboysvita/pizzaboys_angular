import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NavService } from '../../../services/nav.service';
import { CustomizerComponent } from '../../customizer/customizer.component';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [HeaderComponent, SidebarComponent, FooterComponent,
        RouterModule, CustomizerComponent]
})

export class ContentComponent {

    constructor(public navService: NavService) {
        if (window.innerWidth < 1185) {
            navService.collapseSidebar = true;
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
