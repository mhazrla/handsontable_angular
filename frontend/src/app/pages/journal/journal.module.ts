import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalRoutingModule } from './journal-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
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
import { CreateFbl1nComponent } from './fbl1n/create-fbl1n/create-fbl1n.component';
import { Xk03Component } from './xk03/xk03.component';
import { DetailXk03Component } from './xk03/detail-xk03/detail-xk03.component';
import { As03Component } from './as03/as03.component';
import { Yaioff003Component } from './yaioff003/yaioff003.component';
import { Zff001Component } from './zff001/zff001.component';

@NgModule({
  declarations: [
    Fb60Component,
    CreateFb60Component,
    Fb50Component,
    CreateFb50Component,
    F02Component,
    CreateF02Component,
    EditFb60Component,
    EditFb50Component,
    EditF02Component,
    Fb03Component,
    Fbl1nComponent,
    CreateFbl1nComponent,
    Xk03Component,
    DetailXk03Component,
    As03Component,
    Yaioff003Component,
    Zff001Component,
  ],
  imports: [
    CommonModule,
    JournalRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    SharedModule,
    NgSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class JournalModule {}
