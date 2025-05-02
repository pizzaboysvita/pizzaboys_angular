import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../directive/click-outside.directive';
import { NavService, menuItem } from '../../services/nav.service';
import { FeatherIconsComponent } from "../feather-icons/feather-icons.component";
import { MessagesComponent } from './messages/messages.component';
import { ModeComponent } from './mode/mode.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from "./profile/profile.component";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [MessagesComponent, ModeComponent, NotificationsComponent,
        ClickOutsideDirective, ProfileComponent, FeatherIconsComponent,
        RouterModule, FormsModule, CommonModule]
})

export class HeaderComponent {
  notificationsEnabled = true;
  public searchText: string = '';
  public isSearch: boolean = false;

  public items: menuItem[] = [];
  public menuItems: menuItem[] = [];

  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  users: any;

  constructor(public navService: NavService) { 
    this.navService.items.subscribe(
      (menuItems) => (this.items = menuItems)
    );
    const userData = localStorage.getItem("user");
        if (userData !== null) {
          this.users = JSON.parse(userData);
        } else {
          console.log("No user data found in localStorage.");
        }
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

}
