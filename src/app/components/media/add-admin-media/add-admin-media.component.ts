import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-admin-media",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: "./add-admin-media.component.html",
  styleUrl: "./add-admin-media.component.scss",
})
export class AddAdminMediaComponent {
  @Input() editData: any = null;
  @Input() type: any;

  addMediaForm!: FormGroup;
  isSubmitting = false;
  storesList: any[] = [];

  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private apiService: ApisService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.storeList();

    this.addMediaForm = this.fb.group({
      store_id: ["", Validators.required],
      text: ["", Validators.required],
      image: [null, Validators.required],
      video: [null],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      status: [true],
    });

    if (this.type === "Edit" && this.editData) {
      this.addMediaForm.patchValue({
        store_id: this.editData.store_id,
        text: this.editData.text,
        start_date: this.editData.start_date?.replace(" ", "T"),
        end_date: this.editData.end_date?.replace(" ", "T"),
        status: this.editData.status === 1,
      });

      this.addMediaForm.get("image")?.clearValidators();
      this.addMediaForm.get("image")?.updateValueAndValidity();
    }
  }

  get f() {
    return this.addMediaForm.controls;
  }

  storeList() {
    this.apiService.getApi("/api/store").subscribe((data: any) => {
      if (data) {
        this.storesList = data;
      }
    });
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
  }

  async save() {
    if (this.addMediaForm.invalid) {
      this.addMediaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      let imageUrl = this.editData?.image || null;
      let videoUrl = this.editData?.video || null;

      // Upload Image
      if (this.selectedImageFile) {
        const imgRes: any = await firstValueFrom(
          this.apiService.uploadImage(this.selectedImageFile)
        );
        imageUrl = imgRes?.data?.image_url;
      }

      // Upload Video
      if (this.selectedVideoFile) {
        const vidRes: any = await firstValueFrom(
          this.apiService.uploadVideo(this.selectedVideoFile)
        );
        videoUrl = vidRes?.data?.video_url;
      }

      const loginDetails = JSON.parse(
        this.sessionStorage.getsessionStorage("loginDetails") as any
      );

      const payload: any = {
        type: this.type === "Edit" ? "Update" : "Insert",
        store_id: this.addMediaForm.value.store_id,
        banner_image_url: imageUrl,
        banner_video_url: videoUrl,
        banner_text: this.addMediaForm.value.text,
        start_date: this.formatDate(this.addMediaForm.value.start_date),
        end_date: this.formatDate(this.addMediaForm.value.end_date),
        status: this.addMediaForm.value.status ? 1 : 0,
        user_id: loginDetails.user.user_id,
      };

      if (this.type === "Edit") {
        payload.id = this.editData.id;
      }

      const res: any = await firstValueFrom(
        this.apiService.saveBanner(payload)
      );

      this.isSubmitting = false;

      if (res?.code === "1") {
        Swal.fire("Success!", res.message, "success").then(() => {
          this.activeModal.close(true);
        });
      } else {
        Swal.fire("Error", res?.message || "Failed", "error");
      }
    } catch (error: any) {
      console.error("ERROR:", error);
      this.isSubmitting = false;
      Swal.fire("Error", error?.error?.message || "Upload failed", "error");
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.addMediaForm.patchValue({ image: file });
    }
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
      this.addMediaForm.patchValue({ video: file });
    }
  }
}
