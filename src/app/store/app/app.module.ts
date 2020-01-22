import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData  } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt-BR');
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppPageRoutingModule } from './app-routing.module';

import { AppPage } from './app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppPageRoutingModule
  ],
  declarations: [AppPage],
  providers:[
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class AppPageModule {}
