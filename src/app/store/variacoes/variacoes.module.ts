import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariacoesPageRoutingModule } from './variacoes-routing.module';

import { VariacoesPage } from './variacoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VariacoesPageRoutingModule
  ],
  declarations: [VariacoesPage]
})
export class VariacoesPageModule {}
