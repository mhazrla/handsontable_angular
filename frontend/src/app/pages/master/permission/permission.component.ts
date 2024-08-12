import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/core/models/master-admin.model';
import {
  NgbdPermissionSortableHeader,
  permissionSortEvent,
} from './permission-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from './permission.service';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
  providers: [PermissionService, DecimalPipe],
})
export class PermissionComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Form
  permissionForm!: FormGroup;
  submitted = false;
  permissionId: any;

  // Api Data
  content?: any;
  permissions?: any;

  // Table data
  Leads!: Observable<Permission[]>;
  total: Observable<number>;
  @ViewChildren(NgbdPermissionSortableHeader)
  headers!: QueryList<NgbdPermissionSortableHeader>;

  constructor(
    private modalService: NgbModal,
    public service: PermissionService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.Leads = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.permissionForm = this.formBuilder.group({
      id: [''],
      code: ['', [Validators.required]],
      detail: ['', [Validators.required]],
    });

    this.breadCrumbItems = [
      { label: 'Permissions' },
      { label: 'Permission', active: true },
    ];

    this.Leads.subscribe((x) => {
      this.permissions = Object.assign([], x);
    });
  }

  confirm(content: any, id: any) {
    this.permissionId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    this.apiService.delete('master/permission/', id).subscribe({
      next: (res) => {
        this.service.datas = this.service.datas.filter(
          (permission: any) => permission.id !== id
        );
        document.getElementById('r_' + id)?.remove();
        this.alertService.success('Permission has been deleted');
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
    return this.permissionForm.controls;
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
    modelTitle.innerHTML = 'Edit Permission';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = 'Update';


    const permission = this.service.datas.find((item: any) => item.id === id);

    if (permission) {
      this.permissionForm.patchValue({
        id: id,
        code: permission.code,
        detail: permission.detail,
      });
    } else {
      console.error('Permission not found in local data');
    }
  }

  enableEditMode() {
    this.permissionForm.get('id')?.disable();
  }

  cancelEdit() {
    this.permissionForm.reset();
    this.submitted = false;
    this.modalService.dismissAll();
    this.permissionForm.get('id')?.enable();
  }

  savePermission() {
    this.submitted = true;

    if (this.permissionForm.valid) {
      this.permissionForm.get('id')?.enable();

      let id = this.permissionForm.value.id;
      const existingPermission = this.service.datas.find((permission: any) => {
        return permission.id === id;
      });

      if (existingPermission) {
        this.apiService
          .put('master/permission/', id, this.permissionForm.value)
          .subscribe((res: any) => {
            const updatedPermissionIndex = this.service.datas.findIndex(
              (permission: any) => permission.id === res.data[0].id
            );

            if (updatedPermissionIndex !== -1) {
              this.service.datas[updatedPermissionIndex] = res.data[0];
            }

            this.permissionForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('Permission has been edited');
          });
      } else {
        this.apiService
          .post('master/permission', this.permissionForm.value)
          .subscribe((res: any) => {
            this.service.datas.push(res.data[0]);
            this.submitted = true;
            this.permissionForm.reset();
            this.modalService.dismissAll();
            this.alertService.success('Permission has been added');
          });
      }
    }
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: permissionSortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.permissionsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
