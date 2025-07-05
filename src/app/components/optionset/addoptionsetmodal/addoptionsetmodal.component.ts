import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

interface OptionItem {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  hide?: boolean;
  hideOnline?: boolean;
  hidePOS?: boolean;
  hideStandardDish?: boolean;
  hideComboDish?: boolean;
  hidePickup?: boolean;
  hideDelivery?: boolean;
  hideDineIn?: boolean;
  [key: string]: string | number | boolean | undefined;
}

@Component({
  selector: 'app-addoptionsetmodal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbNavModule, NgSelectModule],
  templateUrl: './addoptionsetmodal.component.html',
})
export class AddoptionsetmodalComponent {
  optionSetForm: FormGroup;
  activeTab = 'general';
  hideName = false;

  isOptionSetRequired: boolean = false;
  canSelectMultiple: boolean = false;

  options: OptionItem[] = [];

  selectedVaryOption: string = 'Vary based on other options';

  hideOptionSet = [
    { key: 'always', label: 'Always', checked: false },
    { key: 'pos', label: 'POS', checked: false },
    { key: 'online', label: 'Online Ordering', checked: false },
    { key: 'thirdParty', label: '3rd Party Integration', checked: false }
  ];

  globalHideOptionsArray = [
    { key: 'hide', label: 'Hide', checked: false },
    { key: 'hideOnline', label: 'Hide Online', checked: false },
    { key: 'hidePOS', label: 'Hide POS', checked: false },
    { key: 'hideStandardDish', label: 'Hide Standard Dish', checked: false },
    { key: 'hideComboDish', label: 'Hide Combo Dish', checked: false },
    { key: 'hidePickup', label: 'Hide Pickup', checked: false },
    { key: 'hideDelivery', label: 'Hide Delivery', checked: false },
    { key: 'hideDineIn', label: 'Hide Dine-In', checked: false }
  ];

  hideOptions = [
    { key: 'hide', label: 'Hide' },
    { key: 'hideOnline', label: 'Hide Online' },
    { key: 'hidePOS', label: 'Hide POS' },
    { key: 'hideStandardDish', label: 'Hide Standard Dish' },
    { key: 'hideComboDish', label: 'Hide Combo Dish' },
    { key: 'hidePickup', label: 'Hide Pickup' },
    { key: 'hideDelivery', label: 'Hide Delivery' },
    { key: 'hideDineIn', label: 'Hide Dine-In' }
  ];

  dishTree = [
    {
      name: 'Takeaway Menu',
      checked: false,
      expanded: false,
      children: [
        { name: 'Limited Time Deal', checked: false },
        { name: 'Chicken Wings Special', checked: false },
        { name: 'Deal of the Week', checked: false },
        { name: 'Specials', checked: false },
        { name: 'Lunch', checked: false },
        { name: 'Classic Range Pizzas', checked: false },
        { name: 'Vegetarian Pizzas', checked: false },
        { name: 'Chicken Pizzas', checked: false },
        { name: 'Meat Pizzas', checked: false },
        {
          name: 'Seafood Pizzas',
          checked: false,
          expanded: false,
          children: [
            { name: 'Jamaican Jerk Prawns Pizza (Spicy)', checked: false },
            { name: 'Seafood Supreme', checked: false },
            { name: 'Tropical Caribbean Pizza', checked: false },
            { name: 'Chipotle Prawns Pizza', checked: false },
            { name: 'Creamy Prawns and Bacon Pizza', checked: false },
            { name: 'Garlic Prawns Pizza', checked: false },
            { name: 'Prawn and Bacon Pizza', checked: false },
            { name: 'Salmon and Feta Pizza', checked: false },
            { name: 'Pesto Prawns Pizza', checked: false },
            { name: 'Tuna and Pineapple Pizza', checked: false }
          ]
        },
        { name: 'Standard Sides', checked: false },
        { name: 'Classic Sides', checked: false },
        { name: 'Signature Sides', checked: false },
        { name: 'Premium Sides', checked: false },
        { name: 'Pastas', checked: false },
        { name: "Ben & Jerry's Ice Cream", checked: false },
        { name: 'Dessert', checked: false },
        { name: 'Drinks', checked: false },
        { name: 'Bases', checked: false },
        { name: "Valentine's Day Promotion", checked: false }
      ]
    }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
    this.optionSetForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      status: ['Active', Validators.required],
      dishes: [[]],
    });
  }

  addOption() {
    this.options.push({
      name: '',
      description: '',
      price: 0.00,
      inStock: true,
      hide: false,
      hideOnline: false,
      hidePOS: false,
      hideStandardDish: false,
      hideComboDish: false,
      hidePickup: false,
      hideDelivery: false,
      hideDineIn: false,
    });
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  toggleOptionVisibility(opt: OptionItem, key: string) {
    if (typeof opt[key] === 'boolean') {
      opt[key] = !opt[key];
    } else {
      opt[key] = true;
    }
  }

  toggleGlobalHideOption(hideOption: { key: string; label: string; checked: boolean }) {
    hideOption.checked = !hideOption.checked;
  }

  toggleCategory(category: any) {
    if (category.checked && category.children?.length) {
      category.children.forEach((child: any) => {
        child.checked = true;
      });
    }
  }

  toggleExpand(category: any) {
    category.expanded = !category.expanded;
  }

  misc = {
    hideOnline: false,
    hidePOS: false,
    hidePickup: false,
    includePriceInPromo: false
  };

  submit() {
    if (this.optionSetForm.valid) {
      const selectedDishes = this.getSelectedDishes();
      const formData = {
        ...this.optionSetForm.value,
        options: this.options,
        misc: this.misc,
        hideOptionSet: this.hideOptionSet.filter(o => o.checked).map(o => o.key),
        hideName: this.hideName,
        selectedDishes,
        isOptionSetRequired: this.isOptionSetRequired,
        canSelectMultiple: this.canSelectMultiple,
        selectedVaryOption: this.selectedVaryOption,
        globalHideOptions: this.globalHideOptionsArray.reduce((acc, item) => {
          acc[item.key] = item.checked;
          return acc;
        }, {} as { [key: string]: boolean })
      };
      console.log('Form Submitted:', formData);
      this.activeModal.close(formData);
    }
  }

  getSelectedDishes(): string[] {
    const selected: string[] = [];

    const recurse = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.checked) selected.push(node.name);
        if (node.children) recurse(node.children);
      });
    };

    recurse(this.dishTree);
    return selected;
  }

  close() {
    this.activeModal.dismiss();
  }
}
