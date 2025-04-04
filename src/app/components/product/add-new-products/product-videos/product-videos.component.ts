import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardComponent } from "../../../../shared/components/card/card.component";

@Component({
    selector: 'app-product-videos',
    templateUrl: './product-videos.component.html',
    styleUrl: './product-videos.component.scss',
    imports: [CardComponent, NgSelectModule, FormsModule]
})

export class ProductVideosComponent {

    public selectedVideo: string[] = [];
    public PlaceholderVideo = [
        { id: 1, name: 'Video' },
        { id: 2, name: 'Youtube' },
        { id: 3, name: 'DailyMotion' },
        { id: 4, name: 'Vimeo' },
    ]

}
