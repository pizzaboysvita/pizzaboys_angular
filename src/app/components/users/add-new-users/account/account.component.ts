import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-account',
    imports: [ReactiveFormsModule,CommonModule],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent {
     @Input() form?: FormGroup; // optional for parent form

  accountForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
 ngOnInit(): void {
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      address: [''],
      country: [''],
      state: [''],
      city: [''],
      posPin: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }
   public validateAndSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return false; // ❌ Form invalid
    }

    console.log('Form submitted:', this.accountForm.value);
    return true; // ✅ Form valid
  }
}


