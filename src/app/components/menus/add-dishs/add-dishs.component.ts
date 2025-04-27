import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-dishs',
  imports: [NgbNavModule,NgSelectModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-dishs.component.html',
  styleUrl: './add-dishs.component.scss'
})
export class AddDishsComponent {

 active=1
 public menuList =[
  { id: 1, name: 'TakeWay Menu' },
  { id: 2, name: 'Seasonal menu' },
  {
    id:3, name:'Cycle menu'
  }
 ]
   public PlaceholderSubcategory = [
    { id: 1, name: 'Subcategory Menu' },
    { id: 2, name: 'Ethnic Wear' },
    { id: 3, name: 'Ethnic Bottoms' },
    { id: 4, name: 'Women Western Wear' },
    { id: 5, name: 'Sandels' },
    { id: 6, name: 'Shoes' },
    { id: 7, name: 'Beauty & Grooming' },
  ]
  public categoryList=[
    { id: 1, name: 'Valentines Day Promotion' },
    { id: 2, name: 'Limited Time Deal' },
    { id: 3, name: 'Specials' },
    { id: 4, name: 'Lunch' },
     { id: 5, name: 'Chicken Pizza' },
     { id: 6, name: 'Meat Pizza' },
  ]
  menuForm!: FormGroup;

  constructor(private fb: FormBuilder,public modal: NgbModal) {}

  ngOnInit() {
    this.menuForm = this.fb.group({
      menuType: [null],
      categoryType: [null],
      dishType: ['standard'], // Default selected
      firstName: [''],
      price: [''],
      priceSuffix: [''],
      displayName: [''],
      printName: [''],
      posName: [''],
      description: [''],
      subtitle: ['']
    });
  }
}
