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

@Component({
  selector: "app-view-edit-staff",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardComponent],
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
  selectedPreset: string | null = null;
  defaultImage = "https://www.w3schools.com/howto/img_avatar.png";
  profileImage = "";
  activeTab = "details";
  formReady = false;

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apis: ApisService,
    private router: Router
  ) {}

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
      store: [{ value: "", disabled: this.isViewMode }],
      role: [{ value: "", disabled: this.isViewMode }, Validators.required],
    });

    this.permissionForm = this.fb.group({});
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

  onStatusToggle(event: any) {
    this.staffForm.patchValue({ status: event.target.checked });
  }

  onReset() {
    this.getStaffDetails();
  }

  getStaffDetails() {
    this.apis.getApi(`${AppConstants.api_end_points.staff}/${this.staffId}`).subscribe({
      next: (res: any) => {
        if (res) {
          this.staffForm.patchValue({
            firstName: res.first_name || "",
            lastName: res.last_name || "",
            email: res.email || "",
            phone: res.phone_number || "",
            address: res.address || "",
            country: res.country || "",
            state: res.state || "",
            city: res.city || "",
            pos_pin: res.pos_pin || "",
            status: res.status == 1,
            store: res.store_id || "",
            role: res.role_id || "",
          });

          if (res.permissions) {
            this.patchPermissions(res.permissions);
          }

          this.profileImage = res.profiles || this.defaultImage;
        }
        this.formReady = true;
      },
      error: () => {
        this.formReady = true;
      },
    });
  }

  patchPermissions(permissions: any) {
    for (const section of this.managementSections) {
      const group = this.permissionForm.get(section.key) as FormGroup;
      for (const permission of section.permissions) {
        const key = permission.toLowerCase().replace(/[\s-_]/g, "_");
        if (permissions && key in permissions) {
          group.get(permission)?.setValue(!!permissions[key]);
        }
      }
    }
  }

  getPermissionGroup(key: string): FormGroup {
    return this.permissionForm.get(key) as FormGroup;
  }

  onUpdate() {
    if (this.staffForm.invalid) return;

    const formValues = this.staffForm.getRawValue();
    const permissionValues = this.permissionForm.getRawValue();

    const permissions: any = {};
    for (const sectionKey in permissionValues) {
      const sectionPermissions = permissionValues[sectionKey];
      for (const permKey in sectionPermissions) {
        const snakeKey = permKey.toLowerCase().replace(/[\s-_]/g, "_");
        permissions[snakeKey] = sectionPermissions[permKey];
      }
    }

    const payload = {
      staff_id: this.staffId,
      role_id: formValues.role,
      store_id: formValues.store,
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
      permissions,
    };

    this.apis.putApi(AppConstants.api_end_points.staff, payload).subscribe((res: any) => {
      if (res.code === 1) {
        Swal.fire("Success", res.message, "success").then(() => {
          this.router.navigate(["/staff/staff-list"]);
        });
      }
    });
  }
}
