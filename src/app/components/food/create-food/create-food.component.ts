import { Component } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DropdownComponent } from "../../setting/widgets/dropdown/dropdown.component";

@Component({
    selector: 'app-create-food',
    templateUrl: './create-food.component.html',
    styleUrl: './create-food.component.scss',
    imports: [CardComponent, DropdownComponent, DropzoneModule]
})

export class CreateFoodComponent {

    public restaurant = ['Select Cuisines', 'Pizza', 'PASTA', 'Fries', 'Sandwiches', 'Macaroni', 'Maggi', 'Créole', 'Pasta', 'Mexican'];

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

    onUploadSuccess(args:  DropzoneConfigInterface) {
        console.log("onUploadSuccess:", args);
    }

}
