import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastreSePageRoutingModule } from './cadastre-se-routing.module';

import { CadastreSePage } from './cadastre-se.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CadastreSePageRoutingModule,
  ],
  declarations: [CadastreSePage]
})
export class CadastreSePageModule {}
