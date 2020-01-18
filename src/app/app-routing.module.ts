import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './providers/auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'adm/dashboard',
    redirectTo: 'store',
    pathMatch: 'full'
  },
  {
    path: 'cadastre-se',
    loadChildren: () => import('./cadastre-se/cadastre-se.module').then( m => m.CadastreSePageModule)
  },
  {
    path: 'store/bem-vindo',
    canActivate: [AuthService],
    loadChildren: () => import('./store/bem-vindo/bem-vindo.module').then( m => m.BemVindoPageModule)
  },
  {
    path: 'store/configuracoes',
    canActivate: [AuthService],
    loadChildren: () => import('./store/configuracoes/configuracoes.module').then( m => m.ConfiguracoesPageModule)
  },
  {
    path: 'store/endereco/:key',
    pathMatch: 'full',
    canActivate: [AuthService],
    loadChildren: () => import('./store/endereco/endereco.module').then( m => m.EnderecoPageModule)
  },
  {
    path: 'store',
    canActivate: [AuthService],
    loadChildren: () => import('./store/app/app.module').then( m => m.AppPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
