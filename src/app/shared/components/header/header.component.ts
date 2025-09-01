import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../directive/click-outside.directive';
import { NavService, menuItem } from '../../services/nav.service';
import { FeatherIconsComponent } from "../feather-icons/feather-icons.component";
import { MessagesComponent } from './messages/messages.component';
import { ModeComponent } from './mode/mode.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from "./profile/profile.component";
import { SessionStorageService } from '../../services/session-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PosOrdersComponent } from '../../../components/orders/pos-orders/pos-orders.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [ 
        ClickOutsideDirective, ProfileComponent, FeatherIconsComponent,
        RouterModule, FormsModule, CommonModule]
})

export class HeaderComponent {
  @Input() isOn = false;
  @Input() onLabel = 'ON';
  @Input() offLabel = 'OFF';
  @Output() toggle = new EventEmitter<boolean>();
  notificationsEnabled = true;
  public searchText: string = '';
  public isSearch: boolean = false;

  public items: menuItem[] = [];
  public menuItems: menuItem[] = [];

  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  users: any;
  ishidepos:any;

  constructor(public navService: NavService,private sessionStorageService:SessionStorageService,public router: Router,private modal: NgbModal) { 
    this.navService.items.subscribe(
      (menuItems) => (this.items = menuItems)
    );

    const userData = JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any)

        if (userData !== null) {
          this.users = userData
        } else {
          console.log("No user data found in localStorage.");
        }
  }

ngOnInit(){
   this.ishidepos=this.sessionStorageService.getsessionStorage('Pos')

}
  onToggle() {
    this.isOn = !this.isOn;
    this.toggle.emit(this.isOn);
  }
  searchTerm(term: string) {
    term ? this.addFix() : this.removeFix();
    if (!term) return (this.menuItems = []);
    let itemsData: menuItem[] = [];
    term = term.toLowerCase();
    this.items.forEach((data) => {
      if (!data?.title) return false;
      if (data.title.toLowerCase().includes(term) && data.type === "link") {
        itemsData.push(data);
      }
      if (!data.children) return false;
      data.children.filter((subItems: menuItem) => {
        if (
          subItems.title?.toLowerCase().includes(term) &&
          subItems.type === "link"
        ) {
          subItems.icon = data.icon;
          itemsData.push(subItems);
        }
        return;
      });
      this.checkSearchResultEmpty(itemsData);
      this.menuItems = itemsData;
      return;
    });
    return;
  }

  checkSearchResultEmpty(items: menuItem[]) {
    if (!items.length) this.searchResultEmpty = true;
    else this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
  }

  clickOutside(): void {
    this.searchText = "";
    this.searchResult = false;
    this.searchResultEmpty = false;
  }

  removeFix() {
    this.searchText = "";
    this.searchResult = false;
  }
home(){
   this.router.navigate(["/store-dashboard"]);
    this.sessionStorageService.setsessionStorage('Pos','false')
     setTimeout(() => {
    window.location.reload();
  }, 1000);
}
 orderList() {
    const modalRef = this.modal.open(PosOrdersComponent, {
      windowClass: 'theme-modal',
      centered: true,
      size: 'xl'
    });
  }
}
