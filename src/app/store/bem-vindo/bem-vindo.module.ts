import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BemVindoPageRoutingModule } from './bem-vindo-routing.module';
import { LottieAnimationViewModule } from 'ng-lottie';

import { BemVindoPage } from './bem-vindo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BemVindoPageRoutingModule,
    LottieAnimationViewModule
  ],
  declarations: [BemVindoPage]
})
export class BemVindoPageModule {}
