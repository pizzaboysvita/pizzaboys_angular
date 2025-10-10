import { Component, ViewChild } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddWorkingHourComponent } from "../widgets/add-working-hour/add-working-hour.component";
import {
  FormBuilder,
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
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-add-restaurants",
  imports: [CardComponent, ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: "./add-restaurants.component.html",
  styleUrl: "./add-restaurants.component.scss",
  providers: [NgxMaskPipe],
})
export class AddRestaurantsComponent {
  @ViewChild(AddWorkingHourComponent) addWork!: AddWorkingHourComponent;
  workinghours: any;
  uploadImagUrl: string | ArrayBuffer | null;
  file: File;
  constructor(
    public modal: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private apis: ApisService,
    private router: Router,
    private session: SessionStorageService
  ) {}
  storeForm!: FormGroup;

  addHour() {
    this.session.setsessionStorage("storeType", "add");
    const modalRef = this.modal.open(AddWorkingHourComponent, {
      windowClass: "theme-modal add-hours",
      centered: true,
      size: "lg",
      backdrop: "static",
    });

    modalRef.result
      .then((result) => {
        if (result) {
          console.log(result);
          this.workinghours = result;
        }
      })
      .catch((error) => {
        console.log("Modal dismissed:", error);
      });
  }

  ngOnInit() {
    sessionStorage.removeItem('workingHours');
    this.storeForm = this.fb.group({
      storeName: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^$|^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
          ),
        ],
      ],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
      address: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", Validators.required],
      country: ["", Validators.required],
      status: ["1", Validators.required],
      image: [null, Validators.required],
    });
  }
  addStore() {
    console.log(this.storeForm.value.status);
    console.log(this.workinghours, "step 1");

    if (
      this.storeForm.invalid ||
      !this.workinghours ||
      this.workinghours.length == 0
    ) {
      Object.keys(this.storeForm.controls).forEach((key) => {
        this.storeForm.get(key)?.markAsTouched();
      });
      if (this.workinghours == undefined || this.workinghours.length === 0) {
        this.toastr.error("Working hours are required", "Error");
      }
    } else {
      const req_body = {
        type: "insert",
        store_name: this.storeForm.value.storeName,
        location: this.storeForm.value.address,
        status: this.storeForm.value.status,
        created_by: 1,
        email: this.storeForm.value.email,
        phone: this.storeForm.value.phoneNumber,
        city: this.storeForm.value.city,
        street_address: this.storeForm.value.address,
        password_hash: this.storeForm.value.password,
        state: this.storeForm.value.state,
        country: this.storeForm.value.country,
        zip_code: this.storeForm.value.postalCode,
        updated_by: 1,
        working_hours: this.workinghours,
      };

      console.log(req_body);
      const formData = new FormData();
      formData.append("image", this.file); // Attach Blob with a filename
      formData.append("body", JSON.stringify(req_body));
      this.apis
        .postApi(AppConstants.api_end_points.store_list, formData)
        .subscribe((data: any) => {
          console.log(data);
          if (data.code == 1) {
            sessionStorage.removeItem("workingHours");
            Swal.fire("Success!", data.message, "success").then((result) => {
              if (result) {
                console.log("User clicked OK");
                this.router.navigate(["/restaurants/restaurants-list"]);
              }
            });
          }
        });
    }
  }
  capitalizeWords_firstName(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    this.storeForm.patchValue({
      storeName: input.value,
    });
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

  showRules: boolean = false;

  rules = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  };

  validatePassword() {
    const password = this.storeForm.get("password")?.value || "";

    this.rules.minLength = password.length >= 8;
    this.rules.uppercase = /[A-Z]/.test(password);
    this.rules.lowercase = /[a-z]/.test(password);
    this.rules.number = /[0-9]/.test(password);
    this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  hideRulesIfEmpty() {
    const password = this.storeForm.get("password")?.value || "";
    if (!password) {
      this.showRules = false;
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
