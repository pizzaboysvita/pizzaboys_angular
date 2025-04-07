import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [RouterModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent {

  public loginForm: FormGroup;

  constructor(public router: Router) {
    const userData = localStorage.getItem('user');
    if (userData?.length != null) {
      router.navigate(['/dashboard'])
    }
    this.loginForm = new FormGroup({
      email: new FormControl("Test@gmail.com", [Validators.required, Validators.email]),
      password: new FormControl("test123", Validators.required),
    })
  }

  login() {
    if (this.loginForm.value["email"] == "Test@gmail.com" && this.loginForm.value["password"] == "test123") {
      let user = {
        email: "Test@gmail.com",
        password: "test123",
        name: "test user",
      };
      localStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/product/products"]);
    }else if(this.loginForm.value["email"] == "customer@gmail.com" && this.loginForm.value["password"] == "test123") {
      let user = {
        email: "customer@gmail.com",
        password: "test123",
        name: "customer",
      };
      localStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/dashboard"]);
    }else if(this.loginForm.value["email"] == "pos@gmail.com" && this.loginForm.value["password"] == "test123") {
      let user = {
        email: "pos@gmail.com",
        password: "test123",
        name: "pos",
      };
      localStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/dashboard"]);
    }
  }
}
