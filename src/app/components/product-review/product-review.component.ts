import { Component } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { TableConfig } from '../../shared/interface/table.interface';
import { ProductReview } from '../../shared/data/product.reviews';
import { TableComponent } from '../widgets/table/table.component';

@Component({
    selector: 'app-product-review',
    templateUrl: './product-review.component.html',
    styleUrl: './product-review.component.scss',
    imports: [CardComponent, TableComponent]
})

export class ProductReviewComponent {
     
    public review = ProductReview;
    public tableConfig: TableConfig = { 
        columns: [
            { title: "No.", dataField: 'id' },
            { title: "Customer Name", dataField: 'customer_name' },
            { title: "Product Name", dataField: 'product_name' },
            { title: "Rating", dataField: 'rating',type : 'rating' },
            { title: "Comment", dataField: 'comment'},
            { title: "Published", dataField: 'published',class:'td-check' },
        ],
        data: ProductReview,
    };  

    ngOnInit() {
        if (this.review) {
            let product = this.review.map(element => { 
                return {
                    ...element,
                    published: element.published ? `<i class="ri-checkbox-circle-line font-success"></i>` : '<i class="ri-close-circle-line font-danger"></i>'
                };
            });
            this.tableConfig.data = this.review ? product : [];
        }
    }
}
