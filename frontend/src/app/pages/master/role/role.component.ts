import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/core/models/master-admin.model';
import { Observable } from 'rxjs';
import {
  NgbdRoleSortableHeader,
  roleSortEvent,
} from './role-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DecimalPipe } from '@angular/common';
import { RoleService } from './role.service';

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

  // Api Data
  content?: any;
  roles?: any;

  // Table data
  Leads!: Observable<Role[]>;
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
      id: [''],
      role_name: ['', [Validators.required]],
      detail: ['', [Validators.required]],
    });

    this.breadCrumbItems = [
      { label: 'Roles' },
      { label: 'Role', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.roles = Object.assign([], x);
    });
  }

  confirm(content: any, id: any) {
    this.roleId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    this.apiService.delete('master/role/', id).subscribe({
      next: (res) => {
        this.service.datas = this.service.datas.filter(
          (role: any) => role.id !== id
        );
        document.getElementById('r_' + id)?.remove();
        this.alertService.success('Role has been deleted');
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

  editDataGet(id: any, content: any) {
    this.submitted = false;
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

    const role = this.service.datas.find((item: any) => item.id === id);

    if (role) {
      this.roleForm.patchValue({
        id: id,
        role_name: role.role_name,
        detail: role.detail,
      });
    } else {
      console.error('Role not found in local data');
    }
  }

  enableEditMode() {
    this.roleForm.get('id')?.disable();
  }

  cancelEdit() {
    this.roleForm.reset();
    this.submitted = false;
    this.modalService.dismissAll();
    this.roleForm.get('id')?.enable();
  }

  saveRole() {
    this.submitted = true;

    if (this.roleForm.valid) {
      this.roleForm.get('id')?.enable();

      let id = this.roleForm.value.id;
      const existingRole = this.service.datas.find((role: any) => {
        return role.id === id;
      });

      if (existingRole) {
        this.apiService
          .put('master/role/', id, this.roleForm.value)
          .subscribe((res: any) => {
            const updatedRoleIndex = this.service.datas.findIndex(
              (role: any) => role.id === res.data[0].id
            );

            if (updatedRoleIndex !== -1) {
              this.service.datas[updatedRoleIndex] = res.data[0];
            }

            this.roleForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('Role has been edited');
          });
      } else {
        this.apiService
          .post('master/role', this.roleForm.value)
          .subscribe((res: any) => {
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
