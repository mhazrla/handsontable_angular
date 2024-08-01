import { Component, QueryList, ViewChildren } from '@angular/core';
import { RoleService } from './role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolePermission } from 'src/app/core/models/master-admin.model';
import { Observable } from 'rxjs';
import {
  NgbdRoleSortableHeader,
  roleSortEvent,
} from './role-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  providers: [RoleService, DecimalPipe],
})
export class RoleComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Form
  roleForm!: FormGroup;
  submitted = false;
  roleId: any;
  editRoles: any[] = [];
  isEditMode: boolean = false;

  // Api Data
  content?: any;
  rolesPermissions?: any;
  permissions?: any;
  roles?: any;

  // Table data
  Leads!: Observable<RolePermission[]>;
  total: Observable<number>;
  @ViewChildren(NgbdRoleSortableHeader)
  headers!: QueryList<NgbdRoleSortableHeader>;

  constructor(
    private modalService: NgbModal,
    public service: RoleService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.Leads = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      role_id: ['', [Validators.required]],
      permission_id: ['', [Validators.required]],
    });

    this.breadCrumbItems = [
      { label: 'Roles' },
      { label: 'Role', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.rolesPermissions = Object.assign([], x);
    });

    this.getRoles();
    this.getPermissions();
  }

  confirm(content: any, id: any) {
    this.roleId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(role_id: any) {
    this.apiService.delete('admin/role/', role_id).subscribe({
      next: (res) => {
        this.service.datas = this.service.datas.filter(
          (role: any) => role.role_id !== role_id
        );
        document.getElementById('r_' + role_id)?.remove();
        this.alertService.success('Role has been deleted');
        this.getRoles();
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
    return this.roleForm.controls;
  }

  editDataGet(role_id: any, content: any) {
    this.submitted = false;
    this.isEditMode = true;
    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Role';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = 'Update';

    const role = this.service.datas.find(
      (item: any) => item.role_id === role_id
    );

    if (role) {
      this.roleForm.patchValue({
        role_id: role_id,
        permission_id: role.permissions.map((perm: any) => perm.permission_id),
      });

      this.editRoles = this.service.datas.map((item: any) => ({
        role_id: item.role_id,
        role_name: item.role_name,
      }));
    } else {
      console.error('Role not found in local data');
    }
  }

  enableEditMode() {
    this.roleForm.get('role_id')?.disable();
  }

  cancelEdit() {
    this.roleForm.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.modalService.dismissAll();
    this.roleForm.get('role_id')?.enable();
  }

  saveRole() {
    if (this.roleForm.valid) {
      this.roleForm.get('role_id')?.enable();

      let role_id = this.roleForm.value.role_id;
      const existingRole = this.service.datas.find((role: any) => {
        return role.role_id === role_id;
      });

      if (existingRole) {
        this.apiService
          .put('admin/role/', role_id, this.roleForm.value)
          .subscribe((res: any) => {
            this.getRoles();

            const updatedRoleIndex = this.service.datas.findIndex(
              (role: any) => role.role_id === res.data[0].role_id
            );

            if (updatedRoleIndex !== -1) {
              this.service.datas[updatedRoleIndex] = res.data[0];
            }

            this.submitted = true;
            this.roleForm.reset();
            this.modalService.dismissAll();
            this.isEditMode = false;
            this.alertService.success('Role has been edited');
          });
      } else {
        this.apiService
          .post('admin/role', this.roleForm.value)
          .subscribe((res: any) => {
            this.getRoles();

            this.service.datas.push(res.data[0]);
            this.submitted = true;
            this.roleForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('Role has been added');
          });
      }
    }
  }

  /**
   * Get All Roles
   */
  getRoles() {
    this.apiService.getAll('admin/roles').subscribe((res) => {
      const existingRoleIds = this.service.datas.map(
        (role: any) => role.role_id
      );
      this.roles = res.data.filter(
        (role: any) => !existingRoleIds.includes(role.id)
      );
    });
  }

  /**
   * Get All Permissons
   */
  getPermissions() {
    this.apiService.getAll('admin/permissions').subscribe((data) => {
      this.permissions = data.data;
    });
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: roleSortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.rolesortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
