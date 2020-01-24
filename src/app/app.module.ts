import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Camera } from '@ionic-native/camera/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Contact, Contacts } from '@ionic-native/contacts/ngx';

export const firebaseConfig = {
  apiKey: "AIzaSyCbqEzK7jk04JCfd_TCDt6gHHrvGkE-IN4",
  authDomain: "boutique-erp.firebaseapp.com",
  databaseURL: "https://boutique-erp.firebaseio.com",
  projectId: "boutique-erp",
  storageBucket: "boutique-erp.appspot.com",
  messagingSenderId: "511953502267",
  appId: "1:511953502267:web:325b6006d7f88a1ec55c1e",
  measurementId: "G-NMYY9Y97EE"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAnalyticsModule, // dynamically imports firebase/analytics
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    SMS,
    SocialSharing,
    Contact,
    Contacts
    //{ provide: Camera, useClass: CameraMock }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
