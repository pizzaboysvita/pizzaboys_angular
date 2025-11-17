import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-settings',
  imports: [],
  templateUrl: './pos-settings.component.html',
  styleUrl: './pos-settings.component.scss'
})
export class PosSettingsComponent {
 constructor(public modal: NgbModal,public router: Router) { }
}
