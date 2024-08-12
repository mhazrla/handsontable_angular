import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserDataRoutingModule } from './master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UserComponent } from './user/user.component';
import { NgbdUsersSortableHeader } from './user/user-sortable.directive';
import { NgbdRoleSortableHeader } from './role/role-sortable.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { NgbdPermissionSortableHeader } from './permission/permission-sortable.directive';
import { RoleToPermissionComponent } from './role-to-permission/role-to-permission.component';
import { NgbdRolePermissionsSortableHeader } from './role-to-permission/role-to-permission-sortable.directive';
import { AuthorizationComponent } from './authorization/authorization.component';
import { NgbdAuthorizationsSortableHeader } from './authorization/authorization-sortable.directive';

@NgModule({
  declarations: [
    UserComponent,
    RoleComponent,
    PermissionComponent,
    RoleToPermissionComponent,
    NgbdUsersSortableHeader,
    NgbdRoleSortableHeader,
    NgbdPermissionSortableHeader,
    NgbdRolePermissionsSortableHeader,
    AuthorizationComponent,
    NgbdAuthorizationsSortableHeader,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbTypeaheadModule,
    NgSelectModule,
    FlatpickrModule,
    SharedModule,
    SimplebarAngularModule,
    Ng2SearchPipeModule,
    UserDataRoutingModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MasterModule {}
