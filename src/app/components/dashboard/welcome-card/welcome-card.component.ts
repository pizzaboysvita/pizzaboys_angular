import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-welcome-card',
    templateUrl: './welcome-card.component.html',
    styleUrl: './welcome-card.component.scss',
    imports: [CardComponent, RouterModule]
})
export class WelcomeCardComponent {

}
