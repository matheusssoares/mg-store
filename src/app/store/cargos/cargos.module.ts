import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CargosPageRoutingModule } from './cargos-routing.module';

import { CargosPage } from './cargos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CargosPageRoutingModule
  ],
  declarations: [CargosPage]
})
export class CargosPageModule {}
