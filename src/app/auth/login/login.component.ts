import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApisService } from '../../shared/services/apis.service';
import { AppConstants } from '../../app.constants';
import { SessionStorageService } from '../../shared/services/session-storage.service';

@Component({
    selector: 'app-login',
    imports: [RouterModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent {

  public loginForm: FormGroup;

  constructor(public router: Router,private apis:ApisService,private sessionStorage:SessionStorageService) {
    const userData = localStorage.getItem('user');
    if (userData?.length != null) {
      router.navigate(['/dashboard'])
    }
    this.loginForm = new FormGroup({
      email: new FormControl("admin@pizzaboys.com", [Validators.required, Validators.email]),
      password: new FormControl("Test@123", Validators.required),
    })
  }

  login() {

  if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    } else{
const reqboy={
    "email": this.loginForm.value.email,
    "password_hash": this.loginForm.value.password,
}

this.apis.postApi(AppConstants.api_end_points.log_api,reqboy).subscribe((data:any)=>{
  console.log(data)
  if(data.code ==1){
    console.log(data.staff_id )
    this.sessionStorage.setsessionStorage('loginDetails',JSON.stringify(data))
     this.sessionStorage.setsessionStorage('islogin',true)
    if(data.staff_id =='-1'){
      console.log("innnnnnnn")
      // this.router.navigate(["store-dashboard"]);
      
      this.router.navigate(["/store-dashboard"]);
    }
  }
})


    }








    // if (this.loginForm.value["email"] == "admin@pizzaboys.com" && this.loginForm.value["password"] == "test123") {
    //   let user = {
    //     email: "admin@pizzaboys.com",
    //     password: "test123",
    //     name: "test user",
    //   };
    //   localStorage.setItem("user", JSON.stringify(user));
    //   // this.router.navigate(["/dashboard"]);
    //   this.router.navigate(["/store-dashboard"]);
    // }else if(this.loginForm.value["email"] == "store@pizzaboys.com" && this.loginForm.value["password"] == "test123") {
    //   let user = {
    //     email: "store@pizzaboys.com",
    //     password: "test123",
    //     name: "customer",
    //   };
    //   localStorage.setItem("user", JSON.stringify(user));
    //   this.router.navigate(["/store-dashboard"]);
    //   // this.router.navigate(["/dashboard"]);
    // }else if(this.loginForm.value["email"] =="pos@pizzaboys.com" && this.loginForm.value["password"] == "test123") {
    //   let user = {
    //     email: "pos@pizzaboys.com",
    //     password: "test123",
    //     name: "pos",
    //   };
    //   localStorage.setItem("user", JSON.stringify(user));
    //   this.router.navigate(['/orders/order-detail'], { state: { title: 'Drinks' } });
    //   // this.router.navigate(["/orders/order-detail"]);
    // }
  }
}
