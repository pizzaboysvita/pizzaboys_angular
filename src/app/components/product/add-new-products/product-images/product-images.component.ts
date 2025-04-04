import { Component } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { CardComponent } from "../../../../shared/components/card/card.component";

@Component({
    selector: 'app-product-images',
    templateUrl: './product-images.component.html',
    styleUrl: './product-images.component.scss',
    imports: [CardComponent, DropzoneModule]
})

export class ProductImagesComponent {

    public imageConfig: DropzoneConfigInterface = {
        clickable: true,
        url: 'https://httpbin.org/post',
        uploadMultiple: true,
        addRemoveLinks: true,
    };

    public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6>'

    onUploadSuccessImage(args:  DropzoneConfigInterface) {
        console.log("onUploadError:", args);
    }

    onUploadErrorImage(args:  DropzoneConfigInterface) {
        console.log("onUploadSuccess:", args);
    }

    onUploadErrorThumbnail(args:  DropzoneConfigInterface) {
        console.log("onUploadError:", args);
    }

    onUploadSuccessThumbnail(args:  DropzoneConfigInterface) {
        console.log("onUploadSuccess:", args);
    }


}
