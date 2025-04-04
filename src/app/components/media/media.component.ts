import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from "../../shared/components/card/card.component";
import { MediaLibrary, media } from '../../shared/data/media';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';
import { AddMediaComponent } from './add-media/add-media.component';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss',
    imports: [ClickOutsideDirective, CardComponent]
})

export class MediaComponent {

  constructor(public modal: NgbModal) { }

  public MediaLibrary = MediaLibrary;
  public url: string[];

  open(data: media) {
    this.MediaLibrary.forEach(item => {
      if (data.id === item.id) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
    });
  }

  addMedia() {
    this.modal.open(AddMediaComponent, { windowClass: 'media-modal theme-modal', size: 'xl' })
  }
}
