import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppPage } from './app.page';

const routes: Routes = [
  {
    path: 'app',
    component: AppPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
          }
        ]
      },
      {
        path: 'cadastros',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../cadastros/cadastros.module').then(m => m.CadastrosPageModule)
          }
        ]
      },
      {
        path: 'financeiro',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../financeiro/financeiro.module').then(m => m.FinanceiroPageModule)
          }
        ]
      },
      {
        path: 'relatorios',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../relatorios/relatorios.module').then(m => m.RelatoriosPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'app/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'app/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPageRoutingModule {}
