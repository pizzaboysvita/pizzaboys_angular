import { Component, ViewChild } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { AccountComponent } from "../../users/add-new-users/account/account.component";
import { PermissionComponent } from "../../users/add-new-users/permission/permission.component";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppComponent } from "../../../app.component";
import { AppConstants } from "../../../app.constants";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ApisService } from "../../../shared/services/apis.service";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-staff",
  imports: [
    NgbNavModule,
    CardComponent,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,NgxMaskDirective

  ],
  templateUrl: "./add-staff.component.html",
  styleUrl: "./add-staff.component.scss",
   providers:[NgxMaskPipe]
})
export class AddStaffComponent {
  @ViewChild(AccountComponent) accountComponent!: AccountComponent;
  public active = 1;
  staffForm!: FormGroup;
  permissionForm: FormGroup;
  public ProductPlaceholder = [
    { id: 1, name: "Static Menu" },
    { id: 2, name: "Simple" },
    { id: 3, name: "Classified" },
  ];
  storesList: any;
  presetList = ["Manager", "Front Staff & Kitchen", "Driver", "Menu Manager"];
  selectedPreset: any = 'Super Admin';

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
      description:
        "Restrict your staff member's access to particular pages of the restaurant dashboard ",
    },
    {
      title: "POS Management",
      key: "pos",
      permissions: ["Orders", "Takings"],
      description:
        "Restrict your staff member's access to particular pages of the restaurant dashboard ",
    },
    {
      title: "Website Management",
      key: "website",
      permissions: ["Create", "Edit"],
      description:
        "Restrict your staff member's access to particular website management functions",
    },
    {
      title: "Staff Management",
      key: "staff",
      permissions: ["Create", "Edit", "Delete"],
      description:
        "Restrict your staff member's access to particular staff management fuctions",
    },
  ];
  uploadImagUrl: any;
  rolesList: any;
  rolesId: any;
  file: File;

  constructor(
    private fb: FormBuilder,
    private apis: ApisService,
    private router: Router,private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.permissionForm = this.fb.group({
       store: new FormControl(null, [Validators.required])
    });
    this.initForm();
    this.applyPreset("Manager");
    this.staffForm = this.fb.group(
      {
        firstName: [
          "",
          [Validators.required, Validators.pattern("^[A-Za-z ]+$")],
        ],
        lastName: ["", [Validators.required,Validators.pattern("^[A-Za-z ]+$")]],
        phone: [
          "",
          [Validators.required, Validators.pattern(/^\+?\d[\d\s]{7,13}$/)],
        ],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^$|^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
            ),
          ],
        ],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        address: ["",Validators.required],
        country: ["",Validators.required],
        state: ["",Validators.required],
        city: ["",Validators.required],
        posPin: ["",Validators.required],
        status: [""],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
    this.roles();
    this.storeList();
  }
  passwordMatchValidator(group: FormGroup) {
    const pass = group.get("password")?.value;
    const confirm = group.get("confirmPassword")?.value;
    return pass === confirm ? null : { mismatch: true };
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

  applyPreset(preset: any) {
    console.log(preset);
    this.selectedPreset = preset.role_name;
    this.rolesId = preset.role_id;
    switch (this.selectedPreset) {
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

      case "POS":
        this.setSectionPermissions({
         
         pos: ["Orders", "Takings"],
          
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

  setAll(value: boolean) {
    for (const section of this.managementSections) {
      const group = this.permissionForm.get(section.key) as FormGroup;
      Object.keys(group.controls).forEach((key) =>
        group.get(key)?.setValue(value)
      );
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
  capitalizeWords_firstName(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    this.staffForm.patchValue({
      firstName: input.value,
    });
  }
  capitalizeWords_lastName(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    this.staffForm.patchValue({
      lastName: input.value,
    });
  }
  storeList() {
    this.apis
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.storesList = data;
        }
      });
  }
  roles() {
    this.apis.getApi(AppConstants.api_end_points.roles).subscribe((data) => {
      if (data) {
        this.rolesList = data;
        // this.selectedPreset='Super Admin';
        this.applyPreset(this.rolesList[0])
      }
    });
  }
  preventLeadingSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;

  // Block space if field is empty OR only contains spaces
  if (event.key === ' ' && input.value.trim().length === 0) {
    event.preventDefault();
  }
}
  onSubmit() {
    // if (isValid) {
console.log(this.staffForm.controls,this.permissionForm.controls)
// const restaurantControls = this.permissionForm.get('restaurant')['controls'];
const restaurantGroup = this.permissionForm.get('restaurant') as FormGroup;
const posGroup = this.permissionForm.get('pos') as FormGroup;
const staffGroup = this.permissionForm.get('staff') as FormGroup;
const websiteGroup = this.permissionForm.get('website') as FormGroup;
const storeGroup = this.permissionForm.get('store') as FormGroup;
console.log(this.file)
 if (this.staffForm.invalid || this.permissionForm.invalid || !this.file) {
  if(this.staffForm.invalid || this.permissionForm.invalid){
       this.toastr.error('Fill all Required Fields', 'Error');
  }
     if(!this.file){
         this.toastr.error('Please upload a file', 'Error');
     }
      Object.keys(this.staffForm.controls).forEach(key => {
        this.staffForm.get(key)?.markAsTouched();
      });
       Object.keys(this.permissionForm.controls).forEach(key => {
        this.permissionForm.get(key)?.markAsTouched();
      });
     
    } else {
      


    const req_body: any = {
      type: "insert",
      role_id: this.rolesId,
      store_id: this.permissionForm.value.store,
      first_name: this.staffForm.value.firstName,
      last_name: this.staffForm.value.lastName,
      phone_number: this.staffForm.value.phone,
      email: this.staffForm.value.email,
      password_hash: this.staffForm.value.password,
      address: this.staffForm.value.address,
      country: this.staffForm.value.country,
      state: this.staffForm.value.state,
      city: this.staffForm.value.city,
      pos_pin: this.staffForm.value.posPin,
      status: this.staffForm.value.status == true ? 1 : 0,
      created_by: 1,
      updated_by: 1,
      refresh_token: "",
      permissions: {
        create: restaurantGroup.value.Create,
        dashboard: restaurantGroup.value.Dashboard,
        orders_board_view: restaurantGroup.value.Create,
        orders_list_view:restaurantGroup.value['Orders - List View'],
        orders_delete: restaurantGroup.value['Orders - Delete'],
        bookings: restaurantGroup.value['Bookings'],
        bookings_delete: restaurantGroup.value['Bookings - Delete'],
        customers:restaurantGroup.value['Customers'],
        menus:restaurantGroup.value.Menus,
        menus_images:restaurantGroup.value['Menus - Images'],
        settings_systems:restaurantGroup.value['Settings - Systems'],
        settings_services: restaurantGroup.value['Settings - Services'],
        settings_payments: restaurantGroup.value['Settings - Payments'],
        settings_website: restaurantGroup.value['Settings - Website'],
        settings_integrations: restaurantGroup.value['Settings - Integrations'],
        billing: restaurantGroup.value.Billing,
        reports: restaurantGroup.value.Reports,

        pos_orders:posGroup.value.Orders,
        pos_takings:posGroup.value.Takings,
        website_create:websiteGroup.value.Create,
        website_edit:websiteGroup.value.Edit,
        staff_management_create:staffGroup.value.Create,
        staff_management_edit:staffGroup.value.Edit,
        staff_management_Delete:staffGroup.value.Delete,

      },
    };
    console.log(this.file, req_body);
    const formData = new FormData();
    formData.append("image", this.file); // Attach Blob with a filename
    formData.append("body", JSON.stringify(req_body));
    this.apis
      .postApi(AppConstants.api_end_points.staffV2, formData)
      .subscribe((data: any) => {
        if (data.code == 1) {
          console.log(data);
          Swal.fire("Success!", data.message, "success").then((result) => {
            if (result) {
              console.log("User clicked OK");
              this.router.navigate(["/staff/staff-list"]);
            }
          });
        }
      });
    }
  }
  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      console.log(input.files[0]);
      this.file = input.files[0];
      console.log();
      const reader = new FileReader();

      reader.onload = () => {
        this.uploadImagUrl = reader.result; // this will update the image source
      };

      reader.readAsDataURL(this.file); // convert image to base64 URL
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
  allowOnlyAlphabets(event: KeyboardEvent) {
    const char = event.key;
    const regex = /^[A-Za-z\s]+$/;

    if (!regex.test(char)) {
      event.preventDefault();
    }
  }
   goBack() {
   this.router.navigate(["/staff/staff-list"]);
  }
showRules: boolean = false;

  rules = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  };

  validatePassword() {
    const password = this.staffForm.get("password")?.value || "";

    this.rules.minLength = password.length >= 8;
    this.rules.uppercase = /[A-Z]/.test(password);
    this.rules.lowercase = /[a-z]/.test(password);
    this.rules.number = /[0-9]/.test(password);
    this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  hideRulesIfEmpty() {
    const password = this.staffForm.get("password")?.value || "";
    if (!password) {
      this.showRules = false;
    }
  }

}
