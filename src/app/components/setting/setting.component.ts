import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
    imports: [RouterModule, CardComponent]
})
export class SettingComponent {

}
