import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GeneralSettingsComponent } from "./system/general-settings/general-settings.component";
import { OpeningHoursComponent } from "./system/opening-hours/opening-hours.component";
import { PromocodesComponent } from "./system/promocodes/promocodes.component";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    GeneralSettingsComponent,
    OpeningHoursComponent,
    PromocodesComponent
],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
})
export class SettingsComponent {
  active = 1;
}
