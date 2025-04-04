import { Component } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
    selector: 'app-create-category',
    templateUrl: './create-category.component.html',
    styleUrl: './create-category.component.scss',
    imports: [CardComponent, DropzoneModule]
})

export class CreateCategoryComponent {

    public imageConfig: DropzoneConfigInterface = {
        clickable: true,
        url: 'https://httpbin.org/post',
        uploadMultiple: true,
        addRemoveLinks: true,
    };

    public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6>'

    onUploadError(args: DropzoneConfigInterface) {
        console.log("onUploadError:", args);
    }

    onUploadSuccess(args: DropzoneConfigInterface) {
        console.log("onUploadSuccess:", args);
    }

}
