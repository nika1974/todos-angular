import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  regForm: FormGroup;
  signUpErr: string;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.regForm = this.fb.group({
        email: ['', [Validators.required,
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', Validators.required],
        repassword: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    if (this.regForm.controls.repassword.invalid &&
      (this.regForm.controls.repassword.dirty || this.regForm.controls.repassword.touched) &&
      this.regForm.get('repassword').value === this.regForm.get('password').value) {
      if (this.regForm.controls.repassword.invalid) {
        this.regForm.controls.repassword.setErrors(null);
      }
    }

    return this.regForm.controls[fieldName].invalid &&
      (this.regForm.controls[fieldName].dirty || this.regForm.controls[fieldName].touched);
  }

  isValidRepw(fieldName): boolean {
    return this.regForm.controls[fieldName].invalid &&
      (this.regForm.controls[fieldName].dirty || this.regForm.controls[fieldName].touched) &&
      this.regForm.get([fieldName]).value !== this.regForm.get(['password']).value;
  }

  signUp(): void {
    this.signUpErr = undefined;
    this.auth.signUp(this.regForm.get('email').value, this.regForm.get('password').value).then(user => {
      if (user) {
        user.user.updateProfile({
          displayName: `${this.regForm.get('firstName').value} ${this.regForm.get('lastName').value}`
        }).then(res => {

        });
      }
      this.router.navigate(['/dashboard']);
    }).catch(err => {
      this.signUpErr = err?.message;
    });
  }

  getLangFromStorage() {
    return localStorage.getItem('lang');
  }
}
