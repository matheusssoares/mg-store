import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastreSePage } from './cadastre-se.page';

const routes: Routes = [
  {
    path: '',
    component: CadastreSePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastreSePageRoutingModule {}
