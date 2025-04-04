import { Component } from '@angular/core';
import { ProductInformationComponent } from "./product-information/product-information.component";
import { DescriptionComponent } from "./description/description.component";
import { ProductImagesComponent } from "./product-images/product-images.component";
import { ProductVideosComponent } from "./product-videos/product-videos.component";
import { ProductVariationsComponent } from "./product-variations/product-variations.component";
import { ShippingComponent } from "./shipping/shipping.component";
import { ProductPriceComponent } from "./product-price/product-price.component";
import { ProductInventoryComponent } from "./product-inventory/product-inventory.component";
import { SearchEngineListingComponent } from "./search-engine-listing/search-engine-listing.component";
import { LinkProductsComponent } from "./link-products/link-products.component";

@Component({
    selector: 'app-add-new-products',
    templateUrl: './add-new-products.component.html',
    styleUrl: './add-new-products.component.scss',
    imports: [ProductInformationComponent, DescriptionComponent, ProductImagesComponent,
        ProductVideosComponent, ProductVariationsComponent, ShippingComponent,
        ProductPriceComponent, ProductInventoryComponent, SearchEngineListingComponent, LinkProductsComponent]
})
export class AddNewProductsComponent {

}
