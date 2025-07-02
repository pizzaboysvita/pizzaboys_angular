import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-logging-out',
    imports: [RouterModule],
    templateUrl: './logging-out.component.html',
    styleUrl: './logging-out.component.scss'
})

export class LoggingOutComponent {

  constructor(public modal: NgbModal,public router: Router) { }

  logOut() {
    localStorage.clear();
    this.modal.dismissAll();
    this.router.navigateByUrl("/login");
  }

}
