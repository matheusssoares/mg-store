import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracoesPageRoutingModule } from './configuracoes-routing.module';

import { ConfiguracoesPage } from './configuracoes.page';
import { LottieAnimationViewModule } from 'ng-lottie';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracoesPageRoutingModule,
    LottieAnimationViewModule,
    ReactiveFormsModule,
    BrMaskerModule
  ],
  declarations: [ConfiguracoesPage]
})
export class ConfiguracoesPageModule {}
