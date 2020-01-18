import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeralPageRoutingModule } from './geral-routing.module';

import { GeralPage } from './geral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeralPageRoutingModule
  ],
  declarations: [GeralPage]
})
export class GeralPageModule {}
