import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-done-modal',
    imports: [],
    templateUrl: './done-modal.component.html',
    styleUrl: './done-modal.component.scss'
})

export class DoneModalComponent {

  constructor(public modal :NgbModal){}

}
