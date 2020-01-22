import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormasPagamentoPageRoutingModule } from './formas-pagamento-routing.module';

import { FormasPagamentoPage } from './formas-pagamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormasPagamentoPageRoutingModule
  ],
  declarations: [FormasPagamentoPage]
})
export class FormasPagamentoPageModule {}
