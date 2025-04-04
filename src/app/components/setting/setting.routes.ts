import { Routes } from "@angular/router";
import { ActivationComponent } from "./activation/activation.component";
import { DeliveryComponent } from "./delivery/delivery.component";
import { EmailConfigComponent } from "./email-config/email-config.component";
import { GeneralComponent } from "./general/general.component";
import { NewsLetterComponent } from "./news-letter/news-letter.component";
import { RefundComponent } from "./refund/refund.component";
import { SettingComponent } from "./setting.component";
import { VenderCommissionComponent } from "./vender-commission/vender-commission.component";
import { WalletPointsComponent } from "./wallet-points/wallet-points.component";
import { PaymentMethodComponent } from "./payment-method/payment-method.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { ReCaptchaComponent } from "./re-captcha/re-captcha.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";

export default [
    {
        path: '',
        component: SettingComponent,
        children: [
            {
                path: 'general',
                component : GeneralComponent
            },
            {
                path: 'activation',
                component: ActivationComponent
            },
            {
                path: 'wallet-point',
                component: WalletPointsComponent
            },
            {
                path: 'email-configuration',
                component: EmailConfigComponent,
            },
            {
                path: 'vendor-commission',
                component : VenderCommissionComponent
            },
            {
                path: 'refund',
                component: RefundComponent
            },
            {
                path: 'news-letter',
                component: NewsLetterComponent
            },
            {
                path: 'delivery',
                component:DeliveryComponent
            },
            {
                path: 'payment-method',
                component:PaymentMethodComponent
            },
            {
                path: 'analytics',
                component: AnalyticsComponent
            },
            {
                path: 're-captcha',
                component: ReCaptchaComponent
            },
            {
                path: 'maintenance',
                component:MaintenanceComponent
            },
        ]
    }
] as Routes