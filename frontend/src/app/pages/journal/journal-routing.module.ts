import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Fb60Component } from './fb60/fb60.component';
import { CreateFb60Component } from './fb60/create-fb60/create-fb60.component';
import { Fb50Component } from './fb50/fb50.component';
import { CreateFb50Component } from './fb50/create-fb50/create-fb50.component';
import { F02Component } from './f02/f02.component';
import { CreateF02Component } from './f02/create-f02/create-f02.component';
import { EditFb60Component } from './fb60/edit-fb60/edit-fb60.component';
import { EditFb50Component } from './fb50/edit-fb50/edit-fb50.component';
import { EditF02Component } from './f02/edit-f02/edit-f02.component';
import { Fb03Component } from './fb03/fb03.component';
import { Fbl1nComponent } from './fbl1n/fbl1n.component';
import { Xk03Component } from './xk03/xk03.component';
import { DetailXk03Component } from './xk03/detail-xk03/detail-xk03.component';
import { As03Component } from './as03/as03.component';
import { Yaioff003Component } from './yaioff003/yaioff003.component';
import { Zff001Component } from './zff001/zff001.component';

const routes: Routes = [
  {
    path: 'fb60',
    component: Fb60Component,
  },
  {
    path: 'fb60/create',
    component: CreateFb60Component,
  },
  {
    path: 'fb60/edit/:id',
    component: EditFb60Component,
  },
  {
    path: 'f02',
    component: F02Component,
  },
  {
    path: 'f02/create',
    component: CreateF02Component,
  },
  {
    path: 'f02/edit/:id',
    component: EditF02Component,
  },
  {
    path: 'fb50',
    component: Fb50Component,
  },
  {
    path: 'fb50/create',
    component: CreateFb50Component,
  },
  {
    path: 'fb50/edit/:id',
    component: EditFb50Component,
  },
  {
    path: 'fb03',
    component: Fb03Component,
  },
  {
    path: 'fbl1n',
    component: Fbl1nComponent,
  },
  {
    path: 'xk03',
    component: Xk03Component,
  },
  {
    path: 'xk03/detail',
    component: DetailXk03Component,
  },
  {
    path: 'as03',
    component: As03Component,
  },
  {
    path: 'yaioff003',
    component: Yaioff003Component,
  },
  {
    path: 'zff01',
    component: Zff001Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournalRoutingModule {}
