import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData: any;

  // Form
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  submitted = false;
  WorkLocation = [{ name: 'sukabumi' }, { name: 'kejayan' }];
  Companies = [{ name: 'AIO' }, { name: 'ODI' }];

  constructor(
    private TokenStorageService: TokenStorageService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userData = this.TokenStorageService.getUser();

    this.userForm = this.formBuilder.group({
      user_id: [this.userData.user_id],
      name: [this.userData.name, [Validators.required]],
      nik: [{ value: this.userData.nik, disabled: true }, Validators.required],
      email: [
        { value: this.userData.email, disabled: true },
        [Validators.required],
      ],
      phone_number: [this.userData.phone_number, [Validators.required]],
      work_location: [this.userData.work_location, [Validators.required]],
      company: [this.userData.company, [Validators.required]],
      role: [
        { value: this.userData.role_name, disabled: true },
        [Validators.required],
      ],
    });

    this.passwordForm = this.formBuilder.group(
      {
        user_id: [this.userData.user_id],
        nik: [this.userData.nik],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        old_password: ['', [Validators.required]],
      },
      {
        validator: this.passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  get form() {
    return this.userForm.controls;
  }

  get formPassword() {
    return this.passwordForm.controls;
  }

  saveProfile() {
    this.submitted = true;
    const formValue = this.userForm.getRawValue();

    if (this.userForm.valid) {
      let user_id = this.userForm.value.user_id;

      this.apiService
        .put('profile/', user_id, formValue)
        .subscribe((res: any) => {
          this.userData = res.data.currentUser[0];
          this.TokenStorageService.saveUser('currentUser', this.userData);
          this.TokenStorageService.saveUser('token', res.data.token);

          this.alertService.success('User has been edited');
        });
    }
  }

  changePassword() {
    this.submitted = true;
    const formValue = this.passwordForm.getRawValue();

    if (this.passwordForm.valid) {
      let user_id = formValue.user_id;

      this.apiService
        .put('profile/change-password/', user_id, formValue)
        .subscribe((res: any) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Password has changed',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1500,
          }).then(() => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          });
        });
    }
  }
}
