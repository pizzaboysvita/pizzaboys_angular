import { Component } from '@angular/core';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { addMedia, media } from '../../../shared/data/media';
import { ClickOutsideDirective } from '../../../shared/directive/click-outside.directive';

@Component({
    selector: 'app-add-media',
    imports: [NgbNavModule, ClickOutsideDirective, DropzoneModule],
    templateUrl: './add-media.component.html',
    styleUrl: './add-media.component.scss'
})

export class AddMediaComponent {

  public imageConfig: DropzoneConfigInterface = {
    clickable: true,
    url: 'https://api.imgbb.com/1/upload', 
    uploadMultiple: true,
    addRemoveLinks: true,
  };
  public active: number;
  public addMedia = addMedia;
  public text = '<i class="ri-upload-cloud-2-line"></i><h2>Drop files here, paste <span>or</span><a class="font-blue">browse files</a></h2>'
  constructor(public modal: NgbModal) { }

  open(data: media) {
    this.addMedia.forEach((item) => {
      if (data.id === item.id) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
    });
  }

  onUploadSuccessImage(args:  DropzoneConfigInterface) {
    console.log("onUploadError:", args);
  }

  onUploadErrorImage(args:  DropzoneConfigInterface) {
    console.log("onUploadSuccess:", args);
  }

}
