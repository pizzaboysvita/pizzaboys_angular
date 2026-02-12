import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { AppConstants } from "../../../app.constants";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-admin-media",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: "./add-admin-media.component.html",
  styleUrl: "./add-admin-media.component.scss",
})
export class AddAdminMediaComponent {
  @Input() editData: any = null;
  @Input() type: any;

  addMediaForm!: FormGroup;
  isSubmitting = false;
  storesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private apiService: ApisService,
    private sessionStorage: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStores();

    if (this.type === "Edit" && this.editData) {
      this.patchEditData();
    }
  }

  initForm() {
    this.addMediaForm = this.fb.group({
      store_id: ["", Validators.required],
      text: ["", Validators.required],
      image: ["", Validators.required], // Image URL
      video: [""], // Optional Video URL
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      status: [true],
    });
  }

  patchEditData() {
    this.addMediaForm.patchValue({
      store_id: this.editData.store_id,
      text: this.editData.text,
      image: this.editData.image,
      video: this.editData.video,
      start_date: this.convertToInputDate(this.editData.start_date),
      end_date: this.convertToInputDate(this.editData.end_date),
      status: this.editData.status === 1,
    });
  }

  loadStores() {
    this.apiService
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data: any) => {
        if (data) {
          this.storesList = data;
        }
      });
  }

  get f() {
    return this.addMediaForm.controls;
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
  }

  convertToInputDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toISOString().slice(0, 16); // For datetime-local input
  }

  save() {
    if (this.addMediaForm.invalid) {
      this.addMediaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const loginDetails = JSON.parse(
      this.sessionStorage.getsessionStorage("loginDetails") as any,
    );

    const payload: any = {
      type: this.type === "Edit" ? "Update" : "Insert",
      store_id: this.addMediaForm.value.store_id,
      banner_image_url: this.addMediaForm.value.image,
      banner_text: this.addMediaForm.value.text,
      banner_video_url: this.addMediaForm.value.video || null,
      start_date: this.formatDate(this.addMediaForm.value.start_date),
      end_date: this.formatDate(this.addMediaForm.value.end_date),
      status: this.addMediaForm.value.status ? 1 : 0,
      user_id: loginDetails.user.user_id,
    };

    if (this.type === "Edit") {
      payload.id = this.editData.id;
    }

    this.apiService.saveBanner(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        if (res?.code === "1") {
          Swal.fire("Success!", res.message, "success").then(() => {
            this.activeModal.close(true);
          });
        } else {
          Swal.fire("Error", res.message || "Failed to save banner", "error");
        }
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire("Error", "Server error. Please try again.", "error");
      },
    });
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
