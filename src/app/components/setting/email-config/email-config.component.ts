import { Component } from '@angular/core';
import { DropdownComponent } from "../widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-email-config',
    templateUrl: './email-config.component.html',
    styleUrl: './email-config.component.scss',
    imports: [DropdownComponent]
})

export class EmailConfigComponent {

  public mailer = ['Sendmail','SMTP','Mailgun'];
  public encryption = ['Select Encryption','SSL','TLS'];

}
