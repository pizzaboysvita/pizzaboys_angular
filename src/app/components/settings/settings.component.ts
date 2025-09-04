import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GeneralSettingsComponent } from "./system/general-settings/general-settings.component";
import { OpeningHoursComponent } from "./system/opening-hours/opening-hours.component";
import { PromocodesComponent } from "./system/promocodes/promocodes.component";
import { ConditionalFeeComponent } from "./system/conditional-fee/conditional-fee.component";
import { RecieptPrinterComponent } from "./system/reciept-printer/reciept-printer.component";
import { InfoBarComponent } from "./system/info-bar/info-bar.component";
import { FacebookAdvertisingComponent } from "./system/facebook-advertising/facebook-advertising.component";
import { PickupsComponent } from "./service/pickups/pickups.component";
import { DeliveriesComponent } from "./service/deliveries/deliveries.component";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    GeneralSettingsComponent,
    OpeningHoursComponent,
    PromocodesComponent,
    ConditionalFeeComponent,
    RecieptPrinterComponent,
    InfoBarComponent,
    FacebookAdvertisingComponent,
    PickupsComponent,
    DeliveriesComponent
],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
})
export class SettingsComponent {
  active = 1;
}
