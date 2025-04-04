import { Component } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-product-information',
    imports: [CardComponent, NgSelectModule, FormsModule, TagInputModule],
    templateUrl: './product-information.component.html',
    styleUrl: './product-information.component.scss'
})

export class ProductInformationComponent {

  public items = [];
  public htmlContent = '';
  public selectedProduct: string[] = [];
  public selectedCategory: string[] = [];
  public selectedSubcategory: string[] = [];
  public selectedBrand: string[] = [];
  public selectedUnit: string[] = [];
  public ProductPlaceholder = [
    { id: 1, name: 'Static Menu' },
    { id: 2, name: 'Simple' },
    { id: 3, name: 'Classified' },
  ]

  public PlaceholderCategory = [
    { id: 1, name: 'Category Menu' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'TV & Appliances' },
    { id: 5, name: 'Home & Furniture' },
    { id: 6, name: 'Another' },
    { id: 7, name: 'Baby & Kids' },
    { id: 8, name: 'Health, Beauty & Perfumes' },
    { id: 9, name: 'UnCategorized' },
  ];

  public PlaceholderSubcategory = [
    { id: 1, name: 'Subcategory Menu' },
    { id: 2, name: 'Ethnic Wear' },
    { id: 3, name: 'Ethnic Bottoms' },
    { id: 4, name: 'Women Western Wear' },
    { id: 5, name: 'Sandels' },
    { id: 6, name: 'Shoes' },
    { id: 7, name: 'Beauty & Grooming' },
  ]

  public PlaceholderBrand = [
    { id: 1, name: 'Brand Menu' },
    { id: 2, name: 'Puma' },
    { id: 3, name: 'HRX' },
    { id: 4, name: 'Roadster' },
    { id: 5, name: 'Zara' },
  ]

  public PlaceholderUnit = [
    { id: 1, name: 'Unit Menu' },
    { id: 2, name: 'Kilogram' },
    { id: 3, name: 'Pieces' },
  ]
  
}
