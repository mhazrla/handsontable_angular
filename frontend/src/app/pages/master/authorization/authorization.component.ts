import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Authorization } from 'src/app/core/models/master-admin.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  NgbdAuthorizationsSortableHeader,
  authorizationSortEvent,
} from './authorization-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DecimalPipe } from '@angular/common';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  providers: [AuthorizationService, DecimalPipe],
})
export class AuthorizationComponent {
  // Options
  UserTypes = [{ name: 'Intern' }, { name: 'Employee' }];
  Companies = [{ name: 'AIO' }, { name: 'ODI' }];
  filteredOptions: any[] = [];

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Form
  authorizationForm!: FormGroup;
  submitted = false;
  authorizationId: any;
  isEditMode: boolean = false;

  // Api Data
  content?: any;
  authorizations?: any;
  roles?: any;
  users?: any;
  employees?: any;
  userLogged: any;

  // Table data
  Leads!: Observable<Authorization[]>;
  total: Observable<number>;
  @ViewChildren(NgbdAuthorizationsSortableHeader)
  headers!: QueryList<NgbdAuthorizationsSortableHeader>;

  private AuthorizationSubject = new BehaviorSubject<any[]>([]);
  Authorizations$ = this.AuthorizationSubject.asObservable();

  constructor(
    private modalService: NgbModal,
    public service: AuthorizationService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.Leads = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);

    this.authorizationForm = this.formBuilder.group(
      {
        id: [''],
        user_type: [null, [Validators.required]],
        role_id: [null, [Validators.required]],
        nik: [null, [Validators.required]],
        company: [null, [Validators.required]],
        account_sap: ['', [Validators.required]],
        account_sap_password: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
        confirmPassword: ['', [Validators.required]],
        old_password: [''],
        created_by: [this.userLogged.nik],
      },
      {
        validator: this.passwordMatchValidator(
          'account_sap_password',
          'confirmPassword'
        ),
      }
    );

    this.breadCrumbItems = [
      { label: 'Authorization' },
      { label: 'Authorization', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.AuthorizationSubject.next(Object.assign([], x));
    });

    combineLatest([
      this.Authorizations$,
      this.apiService.getAll('master/users'),
      this.apiService.getEmployee(),
    ]).subscribe(([authorizations, apiUserResponse, employeeResponse]) => {
      this.authorizations = authorizations;

      this.users = apiUserResponse.data
        .filter((user: any) => {
          return !authorizations.some((authorization: any) => {
            return authorization.nik === user.nik;
          });
        })
        .map((user: any) => {
          const concatenatedValue = `${user.nik} - ${user.name}`;
          return { ...user, identity: concatenatedValue };
        });

      this.employees = employeeResponse.data
        .filter((data: any) => {
          return !authorizations.some((authorization: any) => {
            return authorization.nik === data.employee_code;
          });
        })
        .map((data: any) => {
          const concatenatedValue = `${data.employee_code} - ${data.employee_name}`;
          return {
            ...data,
            identity: concatenatedValue,
            nik: data.employee_code,
          };
        });
    });

    this.getRoles();

    this.authorizationForm.get('user_type')?.valueChanges.subscribe((value) => {
      this.updateFilteredOptions(value);
    });
  }

  updateFilteredOptions(user_type: string) {
    if (user_type === 'Intern') {
      this.filteredOptions = this.users;
    } else if (user_type === 'Employee') {
      this.filteredOptions = this.employees;
    } else {
      this.filteredOptions = [];
    }
  }

  getRoles() {
    this.apiService.getAll('master/roles').subscribe((res) => {
      this.roles = res.data;
    });
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

  confirm(content: any, id: any) {
    this.authorizationId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(nik: any) {
    this.apiService.delete('master/authorization/', nik).subscribe({
      next: (res) => {
        this.service.datas = this.service.datas.filter(
          (authorization: any) => authorization.nik !== nik
        );
        document.getElementById('a_' + nik)?.remove();
        this.alertService.success('Data has been deleted');
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message;
      },
    });
  }

  enableEditMode() {
    this.authorizationForm.get('nik')?.disable();
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

  get form() {
    return this.authorizationForm.controls;
  }

  removeValidation() {
    this.authorizationForm.get('account_sap_password')?.clearValidators();
    this.authorizationForm.get('confirmPassword')?.clearValidators();
    this.authorizationForm.get('old_password')?.clearValidators();
    this.authorizationForm
      .get('account_sap_password')
      ?.updateValueAndValidity();
    this.authorizationForm.get('confirmPassword')?.updateValueAndValidity();
    this.authorizationForm.get('old_password')?.updateValueAndValidity();
  }

  editDataGet(nik: any, content: any) {
    this.submitted = false;
    this.isEditMode = true;

    const authorization = this.service.datas.find(
      (item: any) => item.nik === nik
    );

    this.users = this.service.datas.map((user: any) => ({
      ...user,
      identity: `${user.nik} - ${user.name}`,
    }));

    if (authorization) {
      this.authorizationForm.patchValue({
        id: authorization.id,
        nik: authorization.nik,
        role_id: authorization.role_id,
        user_type: authorization.user_type,
        company: authorization.company,
        account_sap: authorization.account_sap,
      });

      this.modalService.open(content, {
        size: 'md',
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });

      var modelTitle = document.querySelector(
        '.modal-title'
      ) as HTMLAreaElement;
      modelTitle.innerHTML = 'Edit Role';
      var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
      updateBtn.innerHTML = 'Update';

      var passwordLabel = document.getElementById(
        'account_sap_password-label'
      ) as HTMLAreaElement;
      passwordLabel.innerHTML = 'New Password';
    }
  }

  cancelEdit() {
    this.authorizationForm.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.modalService.dismissAll();
    this.authorizationForm.get('nik')?.enable();
  }

  saveAuthorization() {
    this.submitted = true;
    const newPassword = this.authorizationForm.value.account_sap_password;
    const confirmPassword = this.authorizationForm.value.confirmPassword;

    if (this.isEditMode) {
      if (newPassword || confirmPassword) {
        this.authorizationForm
          .get('old_password')
          ?.setValidators([Validators.required]);
      } else {
        this.removeValidation();
      }
    }

    if (this.authorizationForm.valid) {
      const formValue = this.authorizationForm.getRawValue();
      formValue.created_by = this.userLogged.nik;

      let nik = formValue.nik;

      const existingAuthorization = this.authorizations.find(
        (authorization: any) => {
          return authorization.nik === nik;
        }
      );

      if (existingAuthorization) {
        this.apiService
          .put('master/authorization/', nik, formValue)
          .subscribe((res: any) => {
            const updatedAuthorizationIndex = this.service.datas.findIndex(
              (user: any) => user.nik === res.data[0].nik
            );

            if (updatedAuthorizationIndex !== -1) {
              this.service.datas[updatedAuthorizationIndex] = res.data[0];
            }

            this.authorizationForm.reset();
            this.modalService.dismissAll();
            this.isEditMode = false;
            this.alertService.success('Data has been edited');
          });
      } else {
        this.apiService
          .post('master/authorization/', formValue)
          .subscribe((res: any) => {
            this.service.datas.push(res.data[0]);
            this.authorizationForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('Data has been added');
          });
      }
    }
    this.authorizationForm.get('nik')?.enable();
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: authorizationSortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.authorizationsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
