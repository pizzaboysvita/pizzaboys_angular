import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { media, MediaLibrary } from '../../../shared/data/media';
import { AddMediaComponent } from '../../media/add-media/add-media.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddDishsComponent } from '../add-dishs/add-dishs.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddMenuModalComponent } from '../add-menu-modal/add-menu-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionStatusComponent } from './action-status/action-status.component';

@Component({
  selector: 'app-menu-list',
  imports: [CardComponent,NgSelectModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent {
  selectedTabIndex = 0;
  constructor(public modal: NgbModal) { }
  public MediaLibrary = MediaLibrary;
  selectedMenuId = 1; // Default selected menu
  menuList = [
    { id: 1, name: 'TakeWay Menu' },
    { id: 2, name: 'Seasonal menu' },
    { id: 3, name: 'Cycle menu' }
  ];
  
  // Tab data grouped by menu ID
  tabsData: { [key: string]: { label: string; icon: string }[] } = {
    '1': [
      { label: 'Lunch', icon: 'ri-settings-line' },
      { label: 'Chicken Pizzas', icon: 'ri-radio-button-line' },
    ],
    '2': [
      { label: 'Seafood Pizzas', icon: 'ri-wallet-line' },
      { label: 'Vegan Pizzas', icon: 'ri-plant-line' },
    ],
    '3': [
      { label: 'Weekly Special', icon: 'ri-calendar-line' }
    ]
  }
  
  get tabs() {
    return this.tabsData[this.selectedMenuId.toString()] || [];
  }
 
  open(data: media) {
    this.MediaLibrary.forEach(item => {
      if (data.id === item.id) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
    });
  }


   insertDish() {
      this.modal.open(AddDishsComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
    }
    insertCategory() {
      this.modal.open(AddCategoryComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
    }
     insertMenu(){
              this.modal.open(AddMenuModalComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
        }
        openPopup(): void {
          // Remove focus from dropdown item (important!)
          // (document.activeElement as HTMLElement)?.blur();
      
          const modalRef = this.modal.open(ActionStatusComponent, {
            centered: true,
          
          });
      
          modalRef.result.then(
            (result) => {
              console.log('Modal closed with:', result);
            },
            () => {
              console.log('Modal dismissed');
            }
          );
        }
      
}
