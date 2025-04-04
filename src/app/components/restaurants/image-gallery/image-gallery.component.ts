import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-image-gallery',
    imports: [],
    templateUrl: './image-gallery.component.html',
    styleUrl: './image-gallery.component.scss'
})

export class ImageGalleryComponent {

  constructor(public commonService :CommonService){}

}
