import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PayPalComponent } from "./pay-pal/pay-pal.component";
import { StripeComponent } from "./stripe/stripe.component";
import { RazorpayComponent } from "./razorpay/razorpay.component";
import { MollieComponent } from "./mollie/mollie.component";
import { CODComponent } from "./cod/cod.component";

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.component.html',
    styleUrl: './payment-method.component.scss',
    imports: [NgbNavModule, PayPalComponent, StripeComponent, RazorpayComponent, MollieComponent, CODComponent]
})
export class PaymentMethodComponent {

  public active: number;

}
