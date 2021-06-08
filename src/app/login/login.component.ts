 import {Component, OnInit} from "@angular/core";
 import {Validators, FormGroup, FormBuilder, FormControl} from "@angular/forms";
 import {LoginObject} from "./shared/login-object.model";
 import {AuthenticationService} from "./shared/authentication.service";
 import {StorageService} from "../login/core/storage.service";
 import {Router} from "@angular/router";
 import {Session} from "../login/core/session.model";

 @Component({
   selector: 'app-login',
   templateUrl: 'login.component.html',
   styleUrls: ['login.component.css']
 })

export class LoginComponent implements OnInit {

  password: FormControl
  username: FormControl

  loginForm: FormGroup;
  submitted: Boolean = false;
  error: {code: number, message: string} = null;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private storageService: StorageService,
              private router: Router) { }

  ngOnInit() {

    this.password = new FormControl()
    this.username = new FormControl()

    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    })
  }

  public submitLogin(): void {
    this.submitted = true;
    this.error = null;
    if(this.loginForm.valid){
      this.authenticationService.login(new LoginObject(this.loginForm.value)).subscribe(
        data => this.correctLogin(data),
        error => {
          this.error = error;
        }
      )
    }
  }

  private correctLogin(data: Session){
    this.storageService.setCurrentSession(data);
    this.router.navigate(['/home']);
  }


}
