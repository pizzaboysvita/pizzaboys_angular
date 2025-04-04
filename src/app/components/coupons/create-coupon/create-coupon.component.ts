import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralComponent } from "./general/general.component";
import { RestrictionComponent } from "./restriction/restriction.component";
import { UsageLimitsComponent } from "./usage-limits/usage-limits.component";
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-create-coupon',
    templateUrl: './create-coupon.component.html',
    styleUrl: './create-coupon.component.scss',
    imports: [NgbNavModule, GeneralComponent, RestrictionComponent, UsageLimitsComponent, CardComponent]
})

export class CreateCouponComponent {

  public active = 1;

}
