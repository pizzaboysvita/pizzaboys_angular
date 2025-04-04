import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { subscriberChart } from '../../../shared/data/setting';

@Component({
    selector: 'app-wallet-points',
    imports: [NgApexchartsModule],
    templateUrl: './wallet-points.component.html',
    styleUrl: './wallet-points.component.scss'
})

export class WalletPointsComponent {

  public subscriberChart = subscriberChart ;

}
