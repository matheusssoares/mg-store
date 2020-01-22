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
          },
          {
            path: 'medidas',
            loadChildren: () =>
              import('../medidas/medidas.module').then(m => m.MedidasPageModule)
          },
          {
            path: 'categorias',
            loadChildren: () =>
              import('../categorias/categorias.module').then(m => m.CategoriasPageModule)
          },
          {
            path: 'departamentos',
            loadChildren: () =>
              import('../departamentos/departamentos.module').then(m => m.DepartamentosPageModule)
          },
          {
            path: 'cargos',
            loadChildren: () =>
              import('../cargos/cargos.module').then(m => m.CargosPageModule)
          },
          {
            path: 'grades',
            loadChildren: () =>
            import('../grades/grades.module').then(m => m.GradesPageModule)
          },
          {
            path: 'grades/variacoes/:key',
            loadChildren: () => 
            import('../variacoes/variacoes.module').then(m => m.VariacoesPageModule)
          },
          {
            path: 'formas-pagamento',
            loadChildren: () =>
            import('../formas-pagamento/formas-pagamento.module').then(m => m.FormasPagamentoPageModule)
          },
          {
            path: 'clientes',
            loadChildren: () =>
            import('../clientes/clientes.module').then(m => m.ClientesPageModule)
          },
          {
            path: 'clientes/adicionar',
            loadChildren: () =>
            import('../clientes/adicionar/adicionar.module').then(m => m.AdicionarPageModule)
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
export class AppPageRoutingModule { }
