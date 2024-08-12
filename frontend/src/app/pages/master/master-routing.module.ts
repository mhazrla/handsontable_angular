import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleToPermissionComponent } from './role-to-permission/role-to-permission.component';
import { AuthorizationComponent } from './authorization/authorization.component';

const routes: Routes = [
  {
    path: 'authorization',
    component: AuthorizationComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'permission',
    component: PermissionComponent,
  },
  {
    path: 'role-permission',
    component: RoleToPermissionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDataRoutingModule {}
