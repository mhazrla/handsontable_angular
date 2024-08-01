import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UserService } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRole } from 'src/app/core/models/master-admin.model';
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
  employee?: any;

  // Table data
  Leads!: Observable<UserRole[]>;
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
    this.userForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nik: ['', [Validators.required]],
      work_location: ['', [Validators.required]],
      role_id: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
    });

    this.breadCrumbItems = [
      { label: 'Users' },
      { label: 'Role', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.users = Object.assign([], x);
    });

    this.getRoles();
    this.getApiUsers();
  }

  confirm(content: any, id: any) {
    console.log(id);
    this.userId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(user_id: any) {
    console.log(user_id);
    this.apiService.delete('admin/user/', user_id).subscribe({
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

  get form() {
    return this.userForm.controls;
  }

  editDataGet(user_id: any, content: any) {
    this.submitted = false;
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

    const user = this.service.datas.find((item: any) => {
      return item.id === user_id;
    });

    if (user) {
      this.userForm.patchValue({
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        name: user.name,
        nik: user.nik,
        phone_number: user.phone_number,
        work_location: user.work_location,
      });

    } else {
      console.error('Role not found in local data');
    }
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
    if (this.userForm.valid) {
      this.userForm.get('nik')?.enable();

      let user_id = this.userForm.value.id;
      const existingUser = this.service.datas.find((user: any) => {
        return user.id === user_id;
      });

      if (existingUser) {
        this.apiService
          .put('admin/user/', user_id, this.userForm.value)
          .subscribe((res: any) => {
            const updatedUserIndex = this.service.datas.findIndex(
              (user: any) => user.id === res.data[0].id
            );

            if (updatedUserIndex !== -1) {
              this.service.datas[updatedUserIndex] = res.data[0];
            }

            this.submitted = true;
            this.userForm.reset();
            this.modalService.dismissAll();
            this.isEditMode = false;
            this.alertService.success('User has been edited');
          });
      } else {
        this.apiService
          .post('admin/user/', this.userForm.value)
          .subscribe((data: any) => {
            this.service.datas.push(data.data[0]);
            this.submitted = true;
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
    this.apiService.getAll('admin/roles').subscribe((res) => {
      this.roles = res.data;
    });
  }

  /**
   * Get All Users from API
   */
  getApiUsers() {
    this.apiService.getEmployee().subscribe((data) => {
      this.employee = data.data.map((user: any) => {
        const concatenatedValue = `${user.employee_code} - ${user.employee_name}`;
        return { ...user, employeeIdentity: concatenatedValue };
      });
    });
  }

  onNikSelected(nik: any) {
    const selectedUser = this.employee.find((user: any) => {
      return user.employee_code === nik;
    });
    if (selectedUser) {
      this.userForm.patchValue({
        name: selectedUser.employee_name,
        email: selectedUser.mail_id,
        phone_number: selectedUser.phone_number,
      });
    }
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
}
