import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
  },
  {
    path: 'journal',
    loadChildren: () =>
      import('./journal/journal.module').then((m) => m.JournalModule),
  },
  {
    path: 'journal',
    loadChildren: () =>
      import('./journal/journal.module').then((m) => m.JournalModule),
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('./invoices/invoices.module').then((m) => m.InvoicesModule),
  },
  {
    path: 'ui',
    loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
  },
  {
    path: 'forms',
    loadChildren: () => import('./form/form.module').then((m) => m.FormModule),
  },
  {
    path: 'permissions',
    loadChildren: () =>
      import('./user-data/user-data.module').then((m) => m.UserDataModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
