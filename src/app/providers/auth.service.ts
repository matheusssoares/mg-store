import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private route: Router, private toastCtrl: ToastController, private loadCtrl: LoadingController, private af: AngularFireAuth, private db: AngularFirestore, public fs: AngularFireStorage) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          console.log('acesso proibido!');
          this.route.navigate(['/home']);
          resolve(false);
        }
      });
    })
  }

  cadastrar_usuario(form) {
    return this.af.auth.createUserWithEmailAndPassword(form.email, form.senha);
  }

  cad_user_db(form) {
    return this.db.collection('usuarios').doc(form.key).set(form);
  }

  getUserLogged() {
    return this.af.auth.currentUser;
  }

  gerarKey() {
    return this.db.createId();
  }

  getUserNome(key: string) {
    return this.db.collection('usuarios').doc(key);
  }

  upload(arquivo) {
    return this.fs.storage.ref('store').child('logo/logo.jpg').putString(arquivo, 'data_url');
  }

  config_loja(arquivo, form) {
    if (arquivo != '') {
      this.fs.storage.ref('store').child(`logomarca/${form.key}/logo.jpg`).putString(arquivo, 'data_url')
        .then((ok) => {
          ok.ref.getDownloadURL().then((imagePath) => {
            form.imagePath = imagePath;
            this.create_config(form);
          })
        }).catch((err) => {
          this.loadCtrl.dismiss();
          console.log(err);
          this.toastCtrl.create({
            message: 'Houve um erro inesperado :(',
            color: 'danger',
            duration: 3000
          }).then((toast) => {
            toast.present();
          })

        })
    } else {
      this.create_config(form);
    }

  }

  create_config(form) {
    this.db.collection('lojas').doc(form.key).update(form).then(() => {
      this.toastCtrl.create({
        message: 'Configurações estabelecidas',
        duration: 3000
      }).then((toast) => {
        this.loadCtrl.dismiss();
        toast.present();

        this.navCtrl.navigateRoot([`store/endereco/${form.key}`]);

      })
    }).catch((err) => {
      console.log(err);
      
      this.toastCtrl.create({
        message: 'Erro inesperado :(',
        duration: 3000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      })
    })
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  update(collection, data) {
    this.db.collection(collection).doc(data.key).update(data).then(() => {
      this.loadCtrl.dismiss();

      this.toastCtrl.create({
        message: 'Endereço inserido com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
        this.navCtrl.navigateRoot(['store']);
      })

    }).catch((err) => {
      console.log(err);

      this.toastCtrl.create({
        message: 'Erro inesperado!',
        duration: 3000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      })
    })
  }

  cadastrar_loja(form) {
    form.key_loja = this.gerarKey();
    this.af.auth.createUserWithEmailAndPassword(form.email, form.senha).then((data) => {
      this.db.collection('lojas').doc(form.key_loja).set({
        key: form.key_loja,
        nome_loja: form.nome_loja,
        primeiro_acesso: true,
        datatime: this.timestamp,
        gerente_key: data.user.uid,
        gerente_nome: form.nome,
        status: true
      }).then(() => {
        form.status = true;
        form.gerente = true;
        this.db.collection('usuarios').doc(data.user.uid).set(form).then(() => {
          this.loadCtrl.dismiss();
          this.toastCtrl.create({
            message: 'Conta criada com sucesso!',
            duration: 3000
          }).then((toast) => {
            toast.present();
            this.navCtrl.navigateRoot(['store/bem-vindo']);
          })
        })
      })
    }).catch((error) => {
      console.log(error);
      this.loadCtrl.dismiss();

      switch (error.code) {
        case 'auth/email-already-in-use':
          this.alertCtrl.create({
            header: 'Atenção!',
            message: 'Este e-mail já está vinculado em outra conta, tente outro.',
            buttons: [{
              text: 'Entendi'
            }]
          }).then((alert) => alert.present())
          break;

        case 'auth/invalid-email':
          this.alertCtrl.create({
            header: 'Atenção!',
            message: 'Este e-mail é inválido, tente outro.',
            buttons: [{
              text: 'Entendi'
            }]
          }).then((alert) => alert.present())
          break;

        case 'auth/operation-not-allowed':
          this.alertCtrl.create({
            header: 'Atenção!',
            message: 'Temporariamente bloqueada esta opção.',
            buttons: [{
              text: 'Entendi'
            }]
          }).then((alert) => alert.present())
          break;

        case 'auth/weak-password':
          this.alertCtrl.create({
            header: 'Atenção!',
            message: 'Senha muito fraca, tente outra.',
            buttons: [{
              text: 'Entendi'
            }]
          }).then((alert) => alert.present())
          break;
      }
    })
    
  }

  getUserByUid() {
    return this.db.collection('usuarios').doc(this.getUserLogged().uid)
  }

  getLojaByKey(key) {
    return this.db.collection('lojas').doc(key);
  }

  logout(){
    this.af.auth.signOut();
    this.navCtrl.navigateRoot(['']);
  }

  login(form){
    this.af.auth.signInWithEmailAndPassword(form.email, form.senha).then((data) => {
      this.loadCtrl.dismiss();
      this.toastCtrl.create({
        message: 'Login efetuado com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
        this.navCtrl.navigateRoot(['store/app/dashboard']);
      })
    }).catch((error) => {
      console.log(error);
      this.loadCtrl.dismiss();
      switch(error.code) {
        case 'auth/invalid-email':
          this.alertCtrl.create({
            header: 'Aviso!',
            message: 'E-mail inválido, tente outro.',
            buttons: [
              {
                text: 'Entendi'
              }
            ]
          }).then((alert) => alert.present())
          break;
        case 'auth/user-disabled':
          this.alertCtrl.create({
            header: 'Aviso!',
            message: 'Usuário bloqueado, fale com seu gerente.',
            buttons: [
              {
                text: 'Entendi'
              }
            ]
          }).then((alert) => alert.present())
          break;
        case 'auth/user-not-found':
          this.alertCtrl.create({
            header: 'Aviso!',
            message: 'Usuário não encontrado, fale com seu gerente.',
            buttons: [
              {
                text: 'Entendi'
              }
            ]
          }).then((alert) => alert.present())
          break;
        case 'auth/wrong-password':
          this.alertCtrl.create({
            header: 'Aviso!',
            message: 'Senha não corresponde ao e-mail informado.',
            buttons: [
              {
                text: 'Entendi'
              }
            ]
          }).then((alert) => alert.present())
          break;
      }
    })
  }

  gerar_medidas(){
    var medidas = [
      
      {
        code: 'BALDE',
        desc: 'BALDE'
      },      
      {
        code: 'BANDEJ',
        desc: 'BANDEJA'
      },
      {
        code: 'BARRA',
        desc: 'BARRA'
      },
      {
        code: 'BLOCO',
        desc: 'BLOCO'
      },
      {
        code: 'CENTO',
        desc: 'CENTO'
      },
      {
        code: 'CJ',
        desc: 'CONJUNTO'
      },
      {
        code: 'CM',
        desc: 'CENTÍMETRO'
      },
      {
        code: 'CM2',
        desc: 'CENTÍMETRO QUADRADO'
      },
      {
        code: 'CX',
        desc: 'CAIXA'
      },
      {
        code: 'CX2',
        desc: 'CAIXA COM 2 UNIDADES'
      },
      {
        code: 'CX3',
        desc: 'CAIXA COM 3 UNIDADES'
      },
      {
        code: 'CX5',
        desc: 'CAIXA COM 5 UNIDADES'
      },
      {
        code: 'CX10',
        desc: 'CAIXA COM 10 UNIDADES'
      },
      {
        code: 'CX15',
        desc: 'CAIXA COM 15 UNIDADES'
      },
      {
        code: 'CX20',
        desc: 'CAIXA COM 20 UNIDADES'
      },
      {
        code: 'CX25',
        desc: 'CAIXA COM 25 UNIDADES'
      },
      {
        code: 'CX50',
        desc: 'CAIXA COM 50 UNIDADES'
      },
      {
        code: 'CX100',
        desc: 'CAIXA COM 100 UNIDADES'
      },
      {
        code: 'DUZIA',
        desc: 'DUZIA'
      },
      {
        code: 'EMBAL',
        desc: 'EMBALAGEM'
      },
      {
        code: 'FARDO',
        desc: 'FARDO'
      },
      {
        code: 'FOLHA',
        desc: 'FOLHA'
      },
      {
        code: 'FRASCO',
        desc: 'FRASCO'
      },
      {
        code: 'GALAO',
        desc: 'GALÃO'
      },
      {
        code: 'GF',
        desc: 'GARRAFA'
      },
      {
        code: 'GRAMAS',
        desc: 'GRAMAS'
      },
      {
        code: 'JOGO',
        desc: 'JOGO'
      },
      {
        code: 'KG',
        desc: 'QUILOGRAMA'
      },
      {
        code: 'KIT',
        desc: 'KIT'
      },
      {
        code: 'LATA',
        desc: 'LATA'
      },
      {
        code: 'LITRO',
        desc: 'LITRO'
      },
      {
        code: 'M',
        desc: 'METRO'
      },
      {
        code: 'M2',
        desc: 'METRO QUADRADO'
      },
      {
        code: 'M3',
        desc: 'METRO CÚBICO'
      },
      {
        code: 'MILHEI',
        desc: 'MILHEIRO'
      },
      {
        code: 'ML',
        desc: 'MILILITRO'
      },
      {
        code: 'PACOTE',
        desc: 'PACOTE'
      },
      {
        code: 'PC',
        desc: 'PEÇA'
      },
      {
        code: 'K',
        desc: 'QUILATE'
      },
      {
        code: 'RESMA',
        desc: 'RESMA'
      },
      {
        code: 'ROLO',
        desc: 'ROLO'
      },
      {
        code: 'SACO',
        desc: 'SACO'
      },
      {
        code: 'SACOLA',
        desc: 'SACOLA'
      },
      {
        code: 'TON',
        desc: 'TONELADA'
      },
      {
        code: 'TUBO',
        desc: 'TUBO'
      },
      {
        code: 'UNID',
        desc: 'UNIDADE'
      },
      {
        code: 'VASIL',
        desc: 'VASILHAME'
      },
      {
        code: 'VIDRO',
        desc: 'VIDRO'
      },

    ]

    medidas.forEach(data => {
      console.log(data); 
      let key = this.gerarKey();
      this.db.collection('medidas').doc(key).set(data)     
    })
    
    //this.db.collection('medidas').doc(key).set(medidas)
  }
}
