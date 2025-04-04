import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
    selector: 'app-restaurants',
    templateUrl: './restaurants.component.html',
    styleUrl: './restaurants.component.scss',
    imports: [RouterModule, CardComponent]
})
export class RestaurantsComponent {

}
