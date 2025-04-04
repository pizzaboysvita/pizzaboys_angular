import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownComponent } from "../../setting/widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-restaurant-info',
    templateUrl: './restaurant-info.component.html',
    styleUrl: './restaurant-info.component.scss',
    imports: [DropdownComponent]
})

export class RestaurantInfoComponent {

  constructor(public commonService :CommonService){}

  public category = ['Select Cuisines','Pizza','PASTA','Fries','Sandwiches','Macaroni','Maggi','Créole','Pasta','Mexican']

}
