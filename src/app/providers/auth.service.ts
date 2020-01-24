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
        form.user_key = data.user.uid;
        this.db.collection('usuarios').doc(form.user_key).set(form).then(() => {
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

  logout() {
    this.af.auth.signOut();
    this.navCtrl.navigateRoot(['']);
  }

  login(form) {
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
      switch (error.code) {
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

  /*   gerar_medidas() {
      var medidas = [
  
        {
          code: 'BALDE',
          desc: 'BALDE',
          key_loja: 'geral'
        },
        {
          code: 'BANDEJ',
          desc: 'BANDEJA',
          key_loja: 'geral'
        },
        {
          code: 'BARRA',
          desc: 'BARRA',
          key_loja: 'geral'
        },
        {
          code: 'BLOCO',
          desc: 'BLOCO',
          key_loja: 'geral'
        },
        {
          code: 'CENTO',
          desc: 'CENTO',
          key_loja: 'geral'
        },
        {
          code: 'CJ',
          desc: 'CONJUNTO',
          key_loja: 'geral'
        },
        {
          code: 'CM',
          desc: 'CENTÍMETRO',
          key_loja: 'geral'
        },
        {
          code: 'CM2',
          desc: 'CENTÍMETRO QUADRADO',
          key_loja: 'geral'
        },
        {
          code: 'CX',
          desc: 'CAIXA',
          key_loja: 'geral'
        },
        {
          code: 'CX2',
          desc: 'CAIXA COM 2 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX3',
          desc: 'CAIXA COM 3 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX5',
          desc: 'CAIXA COM 5 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX10',
          desc: 'CAIXA COM 10 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX15',
          desc: 'CAIXA COM 15 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX20',
          desc: 'CAIXA COM 20 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX25',
          desc: 'CAIXA COM 25 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX50',
          desc: 'CAIXA COM 50 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'CX100',
          desc: 'CAIXA COM 100 UNIDADES',
          key_loja: 'geral'
        },
        {
          code: 'DUZIA',
          desc: 'DUZIA',
          key_loja: 'geral'
        },
        {
          code: 'EMBAL',
          desc: 'EMBALAGEM',
          key_loja: 'geral'
        },
        {
          code: 'FARDO',
          desc: 'FARDO',
          key_loja: 'geral'
        },
        {
          code: 'FOLHA',
          desc: 'FOLHA',
          key_loja: 'geral'
        },
        {
          code: 'FRASCO',
          desc: 'FRASCO',
          key_loja: 'geral'
        },
        {
          code: 'GALAO',
          desc: 'GALÃO',
          key_loja: 'geral'
        },
        {
          code: 'GF',
          desc: 'GARRAFA',
          key_loja: 'geral'
        },
        {
          code: 'GRAMAS',
          desc: 'GRAMAS',
          key_loja: 'geral'
        },
        {
          code: 'JOGO',
          desc: 'JOGO',
          key_loja: 'geral'
        },
        {
          code: 'KG',
          desc: 'QUILOGRAMA',
          key_loja: 'geral'
        },
        {
          code: 'KIT',
          desc: 'KIT',
          key_loja: 'geral'
        },
        {
          code: 'LATA',
          desc: 'LATA',
          key_loja: 'geral'
        },
        {
          code: 'LITRO',
          desc: 'LITRO',
          key_loja: 'geral'
        },
        {
          code: 'M',
          desc: 'METRO',
          key_loja: 'geral'
        },
        {
          code: 'M2',
          desc: 'METRO QUADRADO',
          key_loja: 'geral'
        },
        {
          code: 'M3',
          desc: 'METRO CÚBICO',
          key_loja: 'geral'
        },
        {
          code: 'MILHEI',
          desc: 'MILHEIRO',
          key_loja: 'geral'
        },
        {
          code: 'ML',
          desc: 'MILILITRO',
          key_loja: 'geral'
        },
        {
          code: 'PACOTE',
          desc: 'PACOTE',
          key_loja: 'geral'
        },
        {
          code: 'PC',
          desc: 'PEÇA',
          key_loja: 'geral'
        },
        {
          code: 'K',
          desc: 'QUILATE',
          key_loja: 'geral'
        },
        {
          code: 'RESMA',
          desc: 'RESMA',
          key_loja: 'geral'
        },
        {
          code: 'ROLO',
          desc: 'ROLO',
          key_loja: 'geral'
        },
        {
          code: 'SACO',
          desc: 'SACO',
          key_loja: 'geral'
        },
        {
          code: 'SACOLA',
          desc: 'SACOLA',
          key_loja: 'geral'
        },
        {
          code: 'TON',
          desc: 'TONELADA',
          key_loja: 'geral'
        },
        {
          code: 'TUBO',
          desc: 'TUBO',
          key_loja: 'geral'
        },
        {
          code: 'UNID',
          desc: 'UNIDADE',
          key_loja: 'geral'
        },
        {
          code: 'VASIL',
          desc: 'VASILHAME',
          key_loja: 'geral'
        },
        {
          code: 'VIDRO',
          desc: 'VIDRO',
          key_loja: 'geral'
        },
  
      ]
  
      medidas.forEach(data => {
        console.log(data);
        let key = this.gerarKey();
        this.db.collection('medidas').doc(key).set(data)
      })
  
    } */

  getAllCollection(collection, order) {
    return this.db.collection(collection, ref => ref.orderBy(order, 'asc')).valueChanges();
  }

  create_medidas(code, desc, key_loja) {
    this.db.collection('medidas', ref => ref.where('desc', '==', desc)
      .where('key_loja', '==', key_loja)).get()
      .subscribe(data => {
        if (data.docs.length >= 1) {
          this.alertCtrl.create({
            header: 'Erro!',
            message: 'Medida já cadastrada',
            buttons: [{
              text: 'Entendi'
            }]
          }).then((alt) => {
            alt.present();
          })
        } else {
          let key = this.gerarKey();
          this.db.collection('medidas').doc(key).set({
            code: code,
            desc: desc,
            key_loja: key_loja,
            key: key
          }).then(() => {
            this.toastCtrl.create({
              message: 'Medida cadastrada com sucesso!',
              duration: 3000
            }).then((toast) => {
              this.loadCtrl.dismiss();
              toast.present();
            })
          })
        }
      })
    /* return this.db.collection('medidas').doc(this.gerarKey()).set() */
  }

  update_medidas(code, desc, key) {
    this.db.collection('medidas', ref => ref.where('desc', '==', desc)).get()
      .subscribe(data => {
        if (data.docs.length >= 1) {
          this.alertCtrl.create({
            header: 'Erro!',
            message: 'Medida já cadastrada',
            buttons: [{
              text: 'Entendi'
            }]
          }).then((alt) => {
            this.loadCtrl.dismiss();
            alt.present();
          })
        } else {
          this.db.collection('medidas').doc(key).update({
            code: code,
            desc: desc,
          }).then(() => {
            this.toastCtrl.create({
              message: 'Medida atualizada com sucesso!',
              duration: 3000
            }).then((toast) => {
              this.loadCtrl.dismiss();
              toast.present();
            })
          })
        }
      })
  }

  getMedidasPadrao() {
    return this.db.collection('medidas', ref => ref.where('key_loja', '==', 'geral').orderBy('code', 'asc'));
  }

  getMedidasByLoja(key_loja) {
    return this.db.collection('medidas', ref => ref.where('key_loja', '==', key_loja)
      .orderBy('code', 'asc'))
  }

  delete_medida(key) {
    this.db.collection('medidas').doc(key).delete().then(() => {
      this.toastCtrl.create({
        message: 'Medida excluída com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
      })
    })
  }

  create_categorias(nome, desc, key_loja) {
    let key = this.gerarKey();
    this.db.collection('categorias').doc(key).set({
      key: key,
      nome: nome,
      desc: desc,
      key_loja: key_loja
    }).then(() => {
      this.toastCtrl.create({
        message: 'Categoria cadastrada com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
      })
    })
  }

  getCategoriasLoja(key_loja) {
    return this.db.collection('categorias', ref => ref.where('key_loja', '==', key_loja).orderBy('nome', 'asc')).valueChanges();
  }

  update_categorias(nome, desc, key) {
    this.db.collection('categorias').doc(key).update({
      nome: nome,
      desc: desc
    }).then(() => {
      this.toastCtrl.create({
        message: 'Categoria editada com sucesso!',
        duration: 3000
      }).then((t) => {
        t.present();
      })
    })
  }

  delete_item(collection, key) {
    this.db.collection(collection).doc(key).delete().then(() => {
      this.toastCtrl.create({
        message: 'Registro excluído com sucesso!',
        duration: 3000
      }).then(t => t.present());
    })
  }

  getDepartamentosLoja(key_loja) {
    return this.db.collection('departamentos', ref => ref.where('key_loja', '==', key_loja).orderBy('nome', 'asc')).valueChanges();
  }

  create_departamentos(nome, desc, key_loja) {
    let key = this.gerarKey();
    this.db.collection('departamentos').doc(key).set({
      key: key,
      nome: nome,
      desc: desc,
      key_loja: key_loja
    }).then(() => {
      this.toastCtrl.create({
        message: 'Departamento cadastrado com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
      })
    })
  }

  update_departamentos(nome, desc, key) {
    this.db.collection('departamentos').doc(key).update({
      nome: nome,
      desc: desc
    }).then(() => {
      this.toastCtrl.create({
        message: 'Departamento editado com sucesso!',
        duration: 3000
      }).then((t) => {
        t.present();
      })
    })
  }

  getCargosLoja(key_loja) {
    return this.db.collection('cargos', ref => ref.where('key_loja', '==', key_loja).orderBy('nome', 'asc')).valueChanges();
  }

  create_cargos(nome, desc, key_loja) {
    let key = this.gerarKey();
    this.db.collection('cargos').doc(key).set({
      key: key,
      nome: nome,
      desc: desc,
      key_loja: key_loja
    }).then(() => {
      this.toastCtrl.create({
        message: 'Cargo cadastrado com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
      })
    })
  }

  update_cargos(nome, desc, key) {
    this.db.collection('cargos').doc(key).update({
      nome: nome,
      desc: desc
    }).then(() => {
      this.toastCtrl.create({
        message: 'Cargo editado com sucesso!',
        duration: 3000
      }).then((t) => {
        t.present();
      })
    })
  }

  create_grade(nome, key_loja) {
    let key = this.gerarKey();
    this.db.collection('grades').doc(key).set({
      key: key,
      nome: nome,
      key_loja: key_loja
    }).then(() => {
      this.toastCtrl.create({
        message: 'Grade cadastrada com sucesso!',
        duration: 3000
      }).then((toast) => {
        toast.present();
      })
    })
  }


  getGradesLoja(key_loja) {
    return this.db.collection('grades', ref => ref.where('key_loja', '==', key_loja).orderBy('nome', 'asc')).valueChanges();
  }

  getGrade(id) {
    return this.db.collection('grades', ref => ref.where('key', '==', id));
  }
  create_variacao(nome, key, key_loja) {
    let chave_variacao = this.gerarKey();
    this.db.collection('variacoes').doc(chave_variacao).set({
      key: chave_variacao,
      nome: nome,
      key_grade: key,
      key_loja: key_loja
    }).then(() => {
      this.toastCtrl.create({
        message: 'Variação adicionada!',
        duration: 2500
      }).then((t) => t.present());
    })
  }

  getVariacoes(grade) {
    return this.db.collection('variacoes', ref => ref.where('key_grade', '==', grade).orderBy('nome', 'asc'));
  }

  gerar_formaspg() {
    let formas = [
      {
        desc: 'CREDIÁRIO',
        key_loja: 'geral',
      },
      {
        desc: 'DINHEIRO',
        key_loja: 'geral'
      },
      {
        desc: 'CARTÃO DE CRÉDITO',
        key_loja: 'geral'
      },
      {
        desc: 'CARTÃO DE DÉBITO',
        key_loja: 'geral'
      }
    ]

    formas.forEach(data => {
      let key = this.gerarKey();
      this.db.collection('formas-pagamento').doc(key).set(data);
    })

  }

  getFormasByLoja(key_loja) {
    return this.db.collection('formas-pagamento', ref => ref.where('key_loja', '==', key_loja).orderBy('desc', 'asc'))
  }

  getFormaspadrao() {
    return this.db.collection('formas-pagamento', ref => ref.where('key_loja', '==', 'geral').orderBy('desc', 'asc'));
  }

  create_formas(desc, key_loja) {
    let key = this.gerarKey();
    this.db.collection('formas-pagamento').doc(key).set({
      key: key,
      desc: desc,
      key_loja: key_loja
    }).then(() => {
      this.toastCtrl.create({
        message: 'Forma de pagamento cadastrada',
        duration: 3000
      }).then((t) => {
        t.present();
      })
    })
  }

  update_formas(desc, key){
    this.db.collection('formas-pagamento').doc(key).update({
      desc: desc
    }).then(() => {
      this.toastCtrl.create({
        message: 'Forma atualizada!',
        duration: 3000
      }).then((t) => t.present())
    })
  }

  upload_arquivo(ref, pasta, nome_arquivo, arquivo){
    return this.fs.storage.ref(ref).child(`${pasta}/${nome_arquivo}`).putString(arquivo, 'data_url');
  }
}
