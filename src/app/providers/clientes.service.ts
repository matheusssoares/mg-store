import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private socialSharing: SocialSharing, private contacts: Contact, private alertCtrl: AlertController, private navCtrl: NavController, private route: Router, private toastCtrl: ToastController, private loadCtrl: LoadingController, private af: AngularFireAuth, private db: AngularFirestore, public fs: AngularFireStorage) { }

  create_registro(collection, cliente) {

    if (cliente.salvar_contato) {
      let contact: Contact = this.contacts.create();

      contact.name = new ContactName(null, null, cliente.nome);
      contact.phoneNumbers = [new ContactField('mobile', cliente.whatsapp)];
      contact.save().then(() => {
      }).catch((err) => {
        console.log(err);
        this.loadCtrl.dismiss();
      });
    }

    this.db.collection(collection).doc(cliente.key).set(cliente)
      .then(() => {
        let toast = this.toastCtrl.create({
          message: 'Cadastro realizado com sucesso!',
          duration: 3000,
        });

        toast.then((t) => {
          this.loadCtrl.dismiss();
          t.present();
          t.onDidDismiss().then(() => {
            if (cliente.enviar_msg) {
              this.socialSharing.shareViaWhatsAppToReceiver(`55${cliente.whatsapp}`, `Olá ${cliente.nome}, mensagem automática via MG Store`).then(() => {
                console.log('mensagem enviada');      
                this.navCtrl.back();
              }).catch((err) => {
                console.log(err);      
              })
            } else {
              this.navCtrl.back();
            }

          })
        })
      }).catch((err) => {
        console.log(err);
      })
  }
  
}
