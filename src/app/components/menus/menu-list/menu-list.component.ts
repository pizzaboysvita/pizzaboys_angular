import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { media, MediaLibrary } from '../../../shared/data/media';
import { AddMediaComponent } from '../../media/add-media/add-media.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddDishsComponent } from '../add-dishs/add-dishs.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddMenuModalComponent } from '../add-menu-modal/add-menu-modal.component';

@Component({
  selector: 'app-menu-list',
  imports: [CardComponent,NgSelectModule],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent {
  selectedTabIndex = 0;
  constructor(public modal: NgbModal) { }
  public MediaLibrary = MediaLibrary;
  tabs = [
    { label: 'Lunch', icon: 'ri-settings-line' },
    { label: 'Chicken Pizzas', icon: 'ri-radio-button-line' },
    { label: 'Seafood Pizzas ', icon: 'ri-wallet-line' }
  ];
  public menuList =[
    { id: 1, name: 'TakeWay Menu' },
    { id: 2, name: 'Seasonal menu' },
    {
      id:3, name:'Cycle menu'
    }
   ]
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
}
