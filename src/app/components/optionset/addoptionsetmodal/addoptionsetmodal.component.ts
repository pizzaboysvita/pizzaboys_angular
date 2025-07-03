import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

// Interface definition for OptionItem
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
  // Add an index signature to allow string indexing for these optional boolean properties
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

  // Properties for the new "Conditions" tab toggles
  isOptionSetRequired: boolean = false;
  canSelectMultiple: boolean = false;

  // Updated 'options' array to match the table structure from the Options Tab TypeScript Snippet
  options: OptionItem[] = [];

  // Data for the "Vary based on other options" dropdown from the Options Tab TypeScript Snippet
  selectedVaryOption: string = 'Vary based on other options'; // For the ng-select dropdown

  hideOptionSet = [
    { key: 'always', label: 'Always', checked: false },
    { key: 'pos', label: 'POS', checked: false },
    { key: 'online', label: 'Online Ordering', checked: false },
    { key: 'thirdParty', label: '3rd Party Integration', checked: false }
  ];

  // globalHideOptionsArray for the eye icon dropdown (global settings) from the Options Tab TypeScript Snippet
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

  // hideOptions for individual option settings (settings icon dropdown) from the Options Tab TypeScript Snippet
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

  // Method to add a new option row to the table (updated to use OptionItem structure)
  addOption() {
    this.options.push({
      name: '',
      description: '',
      price: 0.00,
      inStock: true, // Default to true as per image
      // Initialize all hide properties to false for individual options
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

  // Method to remove an option row from the table
  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  // Method to toggle the visibility (hide) property of an INDIVIDUAL option (used by settings icon dropdown)
  toggleOptionVisibility(opt: OptionItem, key: string) {
    // Now that OptionItem has an index signature, direct access is safer.
    // We still need to check if the property exists and is a boolean.
    if (typeof opt[key] === 'boolean') {
      opt[key] = !opt[key];
    } else {
      // If the property is undefined or not a boolean, set it to true (assuming first click enables it)
      opt[key] = true;
    }
  }

  // Method to toggle the GLOBAL hide options (used by eye icon dropdown)
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
        options: this.options, // Pass the entire options array
        misc: this.misc, // Use the misc object directly
        hideOptionSet: this.hideOptionSet.filter(o => o.checked).map(o => o.key),
        hideName: this.hideName,
        selectedDishes,
        isOptionSetRequired: this.isOptionSetRequired,
        canSelectMultiple: this.canSelectMultiple,
        selectedVaryOption: this.selectedVaryOption, // Include the selected vary option
        // Include the global hide options in the form data
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
