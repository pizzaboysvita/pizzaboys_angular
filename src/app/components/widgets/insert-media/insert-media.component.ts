import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsertMedia } from '../../../shared/data/restaurant';

@Component({
    selector: 'app-insert-media',
    imports: [],
    templateUrl: './insert-media.component.html',
    styleUrl: './insert-media.component.scss'
})

export class InsertMediaComponent {

  constructor(public modal: NgbModal){ }

  public InsertMedia = InsertMedia ;

}
