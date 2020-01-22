import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdicionarPageRoutingModule } from './adicionar-routing.module';

import { AdicionarPage } from './adicionar.page';
import { BrMaskerModule } from 'br-mask';
import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule 
  ],
  declarations: [AdicionarPage]
})
export class AdicionarPageModule {}
