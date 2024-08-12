import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UserService } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/master-admin.model';
import { Observable } from 'rxjs';
import {
  NgbdUsersSortableHeader,
  userSortEvent,
} from './user-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, DecimalPipe],
})
export class UserComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Form
  userForm!: FormGroup;
  submitted = false;
  WorkLocation = [{ name: 'sukabumi' }, { name: 'kejayan' }];
  userId: any;
  isEditMode: boolean = false;

  // Api Data
  content?: any;

  users?: any;
  roles?: any;

  // Table data
  Leads!: Observable<User[]>;
  total: Observable<number>;
  @ViewChildren(NgbdUsersSortableHeader)
  headers!: QueryList<NgbdUsersSortableHeader>;

  constructor(
    private modalService: NgbModal,
    public service: UserService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.Leads = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        id: [''],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        nik: ['', [Validators.required]],
        work_location: ['', [Validators.required]],
        phone_number: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        old_password: [''],
      },
      {
        validator: this.passwordMatchValidator('password', 'confirmPassword'),
      }
    );

    this.breadCrumbItems = [
      { label: 'Users' },
      { label: 'User', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.users = Object.assign([], x);
    });
  }

  confirm(content: any, id: any) {
    this.userId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(user_id: any) {
    this.apiService.delete('master/user/', user_id).subscribe({
      next: (res) => {
        this.service.datas = this.service.datas.filter(
          (user: any) => user.id !== user_id
        );
        document.getElementById('u_' + user_id)?.remove();
        this.alertService.success('User has been deleted');
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message;
      },
    });
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  editDataGet(user_id: any, content: any) {
    this.submitted = false;
    this.isEditMode = true;
    const user = this.service.datas.find((item: any) => {
      return item.id === user_id;
    });
    if (user) {
      this.userForm.patchValue({
        id: user.id,
        email: user.email,
        name: user.name,
        nik: user.nik,
        phone_number: user.phone_number,
        work_location: user.work_location,
      });
    } else {
      console.error('User not found in local data');
    }

    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit User';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = 'Update';

    var passwordLabel = document.getElementById(
      'password-label'
    ) as HTMLAreaElement;
    passwordLabel.innerHTML = 'New Password';
  }

  get form() {
    return this.userForm.controls;
  }

  removeValidation() {
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('old_password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.userForm.get('old_password')?.updateValueAndValidity();
  }

  enableEditMode() {
    this.userForm.get('nik')?.disable();
  }

  cancelEdit() {
    this.userForm.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.modalService.dismissAll();
    this.userForm.get('nik')?.enable();
  }

  saveUser() {
    this.submitted = true;
    const newPassword = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;

    if (this.isEditMode) {
      if (newPassword || confirmPassword) {
        this.userForm.get('old_password')?.setValidators([Validators.required]);
      } else {
        this.removeValidation();
      }
    }

    if (this.userForm.valid) {
      this.userForm.get('nik')?.enable();

      let user_id = this.userForm.value.id;
      const existingUser = this.service.datas.find((user: any) => {
        return user.id === user_id;
      });

      if (existingUser) {
        this.apiService
          .put('master/user/', user_id, this.userForm.value)
          .subscribe((res: any) => {
            const updatedUserIndex = this.service.datas.findIndex(
              (user: any) => user.id === res.data[0].id
            );

            if (updatedUserIndex !== -1) {
              this.service.datas[updatedUserIndex] = res.data[0];
            }

            this.userForm.reset();
            this.modalService.dismissAll();
            this.isEditMode = false;
            this.alertService.success('User has been edited');
          });
      } else {
        this.apiService
          .post('master/user/', this.userForm.value)
          .subscribe((res: any) => {
            this.service.datas.push(res.data[0]);
            this.userForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('User has been added');
          });
      }
    }
  }

  /**
   * Get All Roles
   */
  getRoles() {
    this.apiService.getAll('master/roles').subscribe((res) => {
      this.roles = res.data;
    });
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: userSortEvent) {
    this.headers.forEach((header) => {
      if (header.usersortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
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
}
