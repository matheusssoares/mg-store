import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargosPage } from './cargos.page';

const routes: Routes = [
  {
    path: '',
    component: CargosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargosPageRoutingModule {}
