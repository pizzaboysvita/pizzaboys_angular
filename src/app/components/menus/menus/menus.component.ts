import { Component } from '@angular/core';
// import { DishComponent } from '../dish/dish.component';
import { CategoryComponent } from '../category/category.component';
import { AddMenusComponent } from '../add-menus/add-menus.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../../shared/components/card/card.component';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { OptionsetComponent } from '../../optionset/optionset.component';

@Component({
  selector: 'app-menus',
  imports: [CardComponent, NgbNavModule,MenuListComponent,CategoryComponent,AddMenusComponent,OptionsetComponent],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent {
  active=1
}
