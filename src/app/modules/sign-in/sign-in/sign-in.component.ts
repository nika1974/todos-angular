import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  signInErr: string;
  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
        email: ['', [Validators.required,
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
        password: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }

  login(): void {
    this.signInErr = undefined;
    this.auth.signIn(this.loginForm.get('email').value, this.loginForm.get('password').value).then(res => {
      this.router.navigate(['/dashboard']);
    }).catch(err => {
      this.signInErr = err?.message;
    });
  }

  popupSignInSuccess(router) {
    router.navigate(['/dashboard']);
  }

  getLangFromStorage() {
    return localStorage.getItem('lang');
  }
}
