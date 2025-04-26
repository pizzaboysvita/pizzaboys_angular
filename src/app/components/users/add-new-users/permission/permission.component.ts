import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
  imports: [
    ReactiveFormsModule
  ]
})
export class PermissionComponent {
  permissionForm: FormGroup;
  presetList = [ 'Manager','Front Staff & Kitchen', 'Driver' , 'Menu Manager'];
  selectedPreset: string | null = null;

  managementSections = [
    {
      title: 'Restaurant Management',
      key: 'restaurant',
      permissions: ['Create', 'Dashboard', 'Orders - Board View', 'Orders - List View', 'Orders - Delete','Bookings','Bookings - Delete','Customers','Menus','Menus - Images','Settings - Systems','Settings - Services','Settings - Payments','Settings - Website','Settings - Integrations','Billing','Reports'],
      description:"Restrict your staff member's access to particular pages of the restaurant dashboard "
    },
    {
      title: 'POS Management',
      key: 'pos',
      permissions: ['Orders', 'Takings'],
      description:"Restrict your staff member's access to particular pages of the restaurant dashboard "

    },
    {
      title: 'Website Management',
      key: 'website',
      permissions: ['Create', 'Edit'],
      description:"Restrict your staff member's access to particular website management functions"

    },
    {
      title: 'Staff Management',
      key: 'staff',
      permissions: ['Create', 'Edit', 'Delete'],
      description:"Restrict your staff member's access to particular staff management fuctions"
    }
  ];

  constructor(private fb: FormBuilder) {
    this.permissionForm = this.fb.group({});
    this.initForm();
    this.applyPreset('Manager')
  }

  initForm() {
    for (const section of this.managementSections) {
      const group: any = {};
      for (const permission of section.permissions) {
        group[permission] = [false];
      }
      this.permissionForm.addControl(section.key, this.fb.group(group));
    }
  }

  applyPreset(preset: string) {
    this.selectedPreset = preset;

    switch (preset) {
      case 'Manager':
        this.setSectionPermissions({
          restaurant: ['Create', 'Dashboard', 'Orders - Board View', 'Orders - List View', 'Orders - Delete','Bookings','Bookings - Delete','Customers','Menus','Menus - Images','Settings - Systems','Settings - Services','Settings - Payments','Settings - Website','Settings - Integrations','Billing'],
          pos: ['Orders'],
          website: ['Create'],
          staff: []
        });
        break;
      case 'Front Staff & Kitchen':
        this.setSectionPermissions({
          restaurant: ['Dashboard'],
          pos: ['Orders'],
          website: ['Create'],
          staff: []
        });
        break;
     
          case 'Menu Manager':
            this.setSectionPermissions({
              restaurant: ['Dashboard','Orders - Delete','Bookings','Bookings - Delete'],
              pos: [],
              website: [],
              staff: []
            });
            break;
    }
  }

  setAll(value: boolean) {
    for (const section of this.managementSections) {
      const group = this.permissionForm.get(section.key) as FormGroup;
      Object.keys(group.controls).forEach(key => group.get(key)?.setValue(value));
    }
  }

  setSectionPermissions(config: { [key: string]: string[] }) {
    for (const section of this.managementSections) {
      const group = this.permissionForm.get(section.key) as FormGroup;
      for (const permission of section.permissions) {
        group.get(permission)?.setValue(config[section.key]?.includes(permission) ?? false);
      }
    }
  }
}
