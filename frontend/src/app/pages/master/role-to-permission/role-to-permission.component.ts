import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolePermission } from 'src/app/core/models/master-admin.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  NgbdRolePermissionsSortableHeader,
  rolepermissionSortEvent,
} from './role-to-permission-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DecimalPipe } from '@angular/common';
import { RolePermissionService } from './role-to-permission.service';

@Component({
  selector: 'app-role-to-permission',
  templateUrl: './role-to-permission.component.html',
  styleUrls: ['./role-to-permission.component.scss'],
  providers: [RolePermissionService, DecimalPipe],
})
export class RoleToPermissionComponent {
  userLogged: any;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Form
  rolePermissionForm!: FormGroup;
  submitted = false;
  roleId: any;
  isEditMode: boolean = false;

  // Api Data
  content?: any;
  rolePermissions?: any;
  permissions?: any;
  roles?: any;

  // Table data
  Leads!: Observable<RolePermission[]>;
  total: Observable<number>;
  @ViewChildren(NgbdRolePermissionsSortableHeader)
  headers!: QueryList<NgbdRolePermissionsSortableHeader>;

  private rolePermissionSubject = new BehaviorSubject<any[]>([]);
  rolePermissions$ = this.rolePermissionSubject.asObservable();

  constructor(
    private modalService: NgbModal,
    public service: RolePermissionService,
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

    this.rolePermissionForm = this.formBuilder.group({
      role_id: [null, [Validators.required]],
      permission_id: [[], [Validators.required]],
      created_by: [this.userLogged.nik],
    });

    this.breadCrumbItems = [
      { label: 'Role Permission' },
      { label: 'Role Permission', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.rolePermissionSubject.next(Object.assign([], x));
    });

    combineLatest([
      this.rolePermissions$,
      this.apiService.getAll('master/roles'),
    ]).subscribe(([rolePermissions, apiRoleResponse]) => {
      this.rolePermissions = rolePermissions;
      this.roles = apiRoleResponse.data.filter((role: any) => {
        return !rolePermissions.some((rolePermission: any) => {
          return rolePermission.role_id === role.id;
        });
      });
    });

    this.getPermissions();
  }

  confirm(content: any, id: any) {
    this.roleId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(role_id: any) {
    this.apiService.delete('master/role-permissions/', role_id).subscribe({
      next: (res) => {
        this.service.datas = this.service.datas.filter(
          (role: any) => role.role_id !== role_id
        );
        document.getElementById('r_' + role_id)?.remove();
        this.alertService.success('Role has been deleted');
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message;
      },
    });
  }

  enableEditMode() {
    this.rolePermissionForm.get('role_id')?.disable();
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
    return this.rolePermissionForm.controls;
  }

  editDataGet(role_id: any, content: any) {
    this.submitted = false;
    this.isEditMode = true;

    const role = this.service.datas.find(
      (item: any) => item.role_id === role_id
    );

    this.roles = this.service.datas.map((role: any) => ({
      ...role,
      id: role.role_id
    }));

    if (role) {
      this.rolePermissionForm.patchValue({
        role_id: role.role_id,
        permission_id: role.permissions.map((perm: any) => perm.permission_id),
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
    }
  }

  cancelEdit() {
    this.rolePermissionForm.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.modalService.dismissAll();
    this.rolePermissionForm.get('role_id')?.enable();
  }

  saveRole() {
    this.submitted = true;

    if (this.rolePermissionForm.valid) {
      const formValue = this.rolePermissionForm.getRawValue();
      formValue.created_by = this.userLogged.nik;

      let role_id = formValue.role_id;

      const existingRole = this.rolePermissions.find((role: any) => {
        return role.role_id === role_id;
      });

      if (existingRole) {
        this.apiService
          .put('master/role-permissions/', role_id, formValue)
          .subscribe((res: any) => {
            const updatedRoleIndex = this.service.datas.findIndex(
              (role: any) => role.role_id === res.data[0].role_id
            );

            if (updatedRoleIndex !== -1) {
              this.service.datas[updatedRoleIndex] = res.data[0];
            }

            this.rolePermissionForm.reset();
            this.modalService.dismissAll();
            this.isEditMode = false;
            this.alertService.success('Permissions has been edited');
          });
      } else {
        this.apiService
          .post('master/role-permissions/', formValue)
          .subscribe((res: any) => {
            this.service.datas.push(res.data[0]);
            this.isEditMode = false;
            this.rolePermissionForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('Permissions has been added');
          });
      }
    }
    this.rolePermissionForm.get('role_id')?.enable();
  }

  /**
   * Get All Permissons
   */
  getPermissions() {
    this.apiService.getAll('master/permissions').subscribe((res) => {
      this.permissions = res.data;
    });
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: rolepermissionSortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.rolepermissionsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
