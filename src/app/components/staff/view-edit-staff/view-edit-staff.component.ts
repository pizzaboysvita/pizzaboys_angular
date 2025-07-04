// view-edit-staff.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";
import { CardComponent } from "../../../shared/components/card/card.component";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
  selector: "app-view-edit-staff",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    CardComponent,
    NgSelectModule,
  ],
  templateUrl: "./view-edit-staff.component.html",
  styleUrls: ["./view-edit-staff.component.scss"],
})
export class ViewEditStaffComponent implements OnInit {
  staffForm!: FormGroup;
  permissionForm!: FormGroup;
  isViewMode = false;
  staffId!: string;
  rolesList: any[] = [];
  storesList: any[] = [];
  selectedPreset='1';
  defaultImage = "https://www.w3schools.com/howto/img_avatar.png";
  profileImage = "";
  activeTab = "details";
  formReady = false;
  file: File | null = null;

  managementSections = [
    {
      title: "Restaurant Management",
      key: "restaurant",
      permissions: [
        "Create",
        "Dashboard",
        "Orders_board_View",
        "Orders - List View",
        "Orders - Delete",
        "Bookings",
        "Bookings - Delete",
        "Customers",
        "Menus",
        "Menus - Images",
        "Settings - Systems",
        "Settings - Services",
        "Settings - Payments",
        "Settings - Website",
        "Settings - Integrations",
        "Billing",
        "Reports",
      ],
      description: "Restrict access to restaurant features",
    },
    {
      title: "POS Management",
      key: "pos",
      permissions: ["Orders", "Takings"],
      description: "Restrict access to POS",
    },
    {
      title: "Website Management",
      key: "website",
      permissions: ["Create", "Edit"],
      description: "Restrict access to website management",
    },
    {
      title: "Staff Management",
      key: "staff",
      permissions: ["Create", "Edit", "Delete"],
      description: "Restrict access to staff controls",
    },
  ];
  rolesId: any;
  selectedName: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apis: ApisService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const mode = this.route.snapshot.paramMap.get("mode");
    this.staffId = this.route.snapshot.paramMap.get("id") || "";
    this.isViewMode = mode === "view";
    this.initForms();
    this.loadRoles();
    this.loadStores();
    this.getStaffDetails();
  }

  initForms(): void {
    this.staffForm = this.fb.group({
      firstName: [{ value: "", disabled: this.isViewMode }, Validators.required],
      lastName: [{ value: "", disabled: this.isViewMode }],
      email: [{ value: "", disabled: this.isViewMode }, [Validators.required, Validators.email]],
      phone: [{ value: "", disabled: this.isViewMode }],
      address: [{ value: "", disabled: this.isViewMode }],
      country: [{ value: "", disabled: this.isViewMode }],
      state: [{ value: "", disabled: this.isViewMode }],
      city: [{ value: "", disabled: this.isViewMode }],
      pos_pin: [{ value: "", disabled: this.isViewMode }],
      status: [{ value: false, disabled: this.isViewMode }],
      role: [{ value: "", disabled: this.isViewMode }, Validators.required],
    });

    this.permissionForm = this.fb.group({
      store: [{ value: "", disabled: this.isViewMode }],
    });
    for (const section of this.managementSections) {
      const group: any = {};
      for (const permission of section.permissions) {
        group[permission] = [{ value: false, disabled: this.isViewMode }];
      }
      this.permissionForm.addControl(section.key, this.fb.group(group));
    }
  }

  loadRoles() {
    this.apis.getApi(AppConstants.api_end_points.roles).subscribe((res: any) => {
      this.rolesList = res;
    });
  }

  loadStores() {
    this.apis.getApi(AppConstants.api_end_points.store_list).subscribe((res: any) => {
      this.storesList = res;
    });
  }

  getStaffDetails() {
    this.apis.getApi(`${AppConstants.api_end_points.staff}?user_id=${this.staffId}`).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          const staff = res[0];
          this.staffForm.patchValue({
            firstName: staff.first_name || "",
            lastName: staff.last_name || "",
            email: staff.email || "",
            phone: staff.phone_number || "",
            address: staff.address || "",
            country: staff.country || "",
            state: staff.state || "",
            city: staff.city || "",
            pos_pin: staff.pos_pin || "",
            status: staff.status === 1,
            role: staff.role_id || "",
          });
console.log(staff)
          // ✅ Patch store into permissionForm
          this.permissionForm.patchValue({
            store: staff.store_id ,
          });
this.selectedPreset =staff.role_id 
          const parsedPermissions =
            typeof staff.permissions === "string" ? JSON.parse(staff.permissions) : staff.permissions;
          this.patchPermissions(parsedPermissions);
          this.profileImage = staff.profiles
        }
        this.formReady = true;
      },
      error: (err) => {
        console.error("Failed to fetch staff details", err);
        this.formReady = true;
      },
    });
  }


  patchPermissions(permissions: any) {
    if (!permissions) return;
    for (const section of this.managementSections) {
      const group = this.permissionForm.get(section.key) as FormGroup;
      if (!group) continue;
      for (const permission of section.permissions) {
        const key = permission.toLowerCase().replace(/[\s\-]/g, "_");
        const value = permissions[key];
        if (group.get(permission)) {
          group.get(permission)?.setValue(!!value);
        }
      }
    }
  }

  // applyPreset(role: any) {
  //   this.selectedPreset = role.role_name;
  //   for (const section of this.managementSections) {
  //     const sectionGroup = this.getPermissionGroup(section.key);
  //     for (const permission of section.permissions) {
  //       sectionGroup.get(permission)?.setValue(false);
  //     }
  //   }

  //   if (role.permissions) {
  //     for (const key in role.permissions) {
  //       if (role.permissions[key]) {
  //         for (const section of this.managementSections) {
  //           const sectionGroup = this.getPermissionGroup(section.key);
  //           for (const permission of section.permissions) {
  //             const snakeKey = permission.toLowerCase().replace(/[\s-_]/g, "_");
  //             if (key === snakeKey) {
  //               sectionGroup.get(permission)?.setValue(true);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
    applyPreset(preset: any) {
    console.log(preset);
    this.selectedPreset = preset.role_id;
    this.selectedName = preset.role_name;
    this.rolesId = preset.role_id;
    switch (this.selectedName) {
      case "Super Admin":
        this.setSectionPermissions({
          restaurant: [
            "Create",
            "Dashboard",
            "Orders board View",
            "Orders - List View",
            "Orders - Delete",
            "Bookings",
            "Bookings - Delete",
            "Customers",
            "Menus",
            "Menus - Images",
            "Settings - Systems",
            "Settings - Services",
            "Settings - Payments",
            "Settings - Website",
            "Settings - Integrations",
            "Billing",
            "Reports",
          ],
          pos: ["Orders", "Takings"],
          website: ["Create", "Edit"],
          staff: ["Create", "Edit", "Delete"],
        });
        break;
      case "Manager":
        this.setSectionPermissions({
          restaurant: [
            "Create",
            "Dashboard",
            "Orders board View",
            "Orders - List View",
            "Orders - Delete",
            "Bookings",
            "Bookings - Delete",
            "Customers",
            "Menus",
            "Menus - Images",
            "Settings - Systems",
            "Settings - Services",
            "Settings - Payments",
            "Settings - Website",
            "Settings - Integrations",
            "Billing",
          ],
          pos: ["Orders"],
          website: ["Create"],
          staff: [],
        });
        break;
      case "Front Staff & Kitchen":
        this.setSectionPermissions({
          restaurant: ["Dashboard"],
          pos: ["Orders"],
          website: ["Create"],
          staff: [],
        });
        break;

      case "Menu Manager":
        this.setSectionPermissions({
          restaurant: [
            "Dashboard",
            "Orders - Delete",
            "Bookings",
            "Bookings - Delete",
          ],
          pos: [],
          website: [],
          staff: [],
        });
        break;
      case "User":
        this.setSectionPermissions({
          restaurant: [],
          pos: [],
          website: [],
          staff: [],
        });
        break;
    }
  }

   setSectionPermissions(config: { [key: string]: string[] }) {
    for (const section of this.managementSections) {
      const group = this.permissionForm.get(section.key) as FormGroup;
      for (const permission of section.permissions) {
        group
          .get(permission)
          ?.setValue(config[section.key]?.includes(permission) ?? false);
      }
    }
  }
  getPermissionGroup(key: string): FormGroup {
    return this.permissionForm.get(key) as FormGroup;
  }

  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }

  onStatusToggle(event: any) {
    this.staffForm.patchValue({ status: event.target.checked });
  }

  onReset() {
    this.getStaffDetails();
  }

  onUpdate() {
    if (this.staffForm.invalid) return;

    const formValues = this.staffForm.getRawValue();
    const permissionValues = this.permissionForm.getRawValue();

    if (!permissionValues.store) {
      Swal.fire("Error", "Please select a store", "error");
      return;
    }

    if (!this.file && (!this.profileImage || this.profileImage === this.defaultImage)) {
      Swal.fire("Error", "Please upload a profile image", "error");
      return;
    }

    const permissions: any = {};
    for (const sectionKey in permissionValues) {
      const sectionPermissions = permissionValues[sectionKey];
      for (const permKey in sectionPermissions) {
        const snakeKey = permKey.toLowerCase().replace(/[\s-_]/g, "_");
        permissions[snakeKey] = sectionPermissions[permKey];
      }
    }

    const reqBody: any = {
      type: "update",
      user_id: this.staffId,
      role_id: formValues.role,
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      email: formValues.email,
      phone_number: formValues.phone,
      address: formValues.address,
      country: formValues.country,
      state: formValues.state,
      city: formValues.city,
      pos_pin: formValues.pos_pin,
      status: formValues.status ? 1 : 0,
      created_by: 1,
      updated_by: 1,
      refresh_token: "",
      permissions,
      store_id: permissionValues.store,
    };

    if (!this.file && this.profileImage && this.profileImage !== this.defaultImage) {
      reqBody.profileImage = this.profileImage;
    }

    const formData = new FormData();
    if (this.file) {
      formData.append("image", this.file);
    }
    formData.append("body", JSON.stringify(reqBody));

    this.apis.postApi(AppConstants.api_end_points.staff, formData).subscribe({
      next: (res: any) => {
        // 🔍 Debug log (optional)
        console.log("API response:", res);
        console.log("res.code type:", typeof res.code, "value:", res.code);

        if (Number(res.code) === 1) {
          Swal.fire("Success", res.message, "success").then(() => {
            this.router.navigate(["/staff/staff-list"]);
          });
        } else {
          Swal.fire("Error", res.message || "Unknown error", "error");
        }
      },
      error: (err) => {
        Swal.fire("Error", "Failed to update staff", "error");
        console.error(err);
      },
    });
  }

}
