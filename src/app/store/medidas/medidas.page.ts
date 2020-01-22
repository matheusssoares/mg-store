import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.page.html',
  styleUrls: ['./medidas.page.scss'],
})
export class MedidasPage implements OnInit {
  itens: any;
  Allmedidas: any;
  key_loja: string;
  array_loja: Array<any>;
  array_padrao: Array<any>;
  constructor(private alertCtrl: AlertController, private toast: ToastController, private loadCtrl: LoadingController, private auth: AuthService) { }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Aguarde...'
    }).then((load) => {
      load.present();
      this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
        this.key_loja = data.key_loja;
        this.getMedidasLoja(this.key_loja);
      }, (err) => {
        load.dismiss();
        console.log(err);

      })
    })
  }
  getMedidasLoja(key_loja) {
    this.auth.getMedidasByLoja(key_loja).valueChanges().subscribe((data: any) => {
      this.array_loja = data;

      this.getMedidasPadrao();
    }, (err) => {
      this.loadCtrl.dismiss();
      console.log(err);

    });

  }
  getMedidasPadrao() {
    this.auth.getMedidasPadrao().valueChanges().subscribe((data: any) => {
      this.array_padrao = data;

      var i: Array<any> = this.array_loja.concat(this.array_padrao);

      this.itens = i.sort((a, b) => a.code.localeCompare(b.code));

      this.Allmedidas = this.itens;

      this.loadCtrl.dismiss();

    }, (err) => {
      this.loadCtrl.dismiss();
      console.log(err);

    })
  }
  filter(item: any) {
    let val = item.target.value;

    if (val && val.trim() != '') {
      this.itens = this.Allmedidas;
      this.itens = this.itens.filter((item) => {
        return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.itens = this.Allmedidas;
    }
  }

  add() {
    this.alertCtrl.create({
      header: 'Adicionar Medidas',
      inputs: [
        {
          id: 'code',
          type: 'text',
          name: 'code',
          label: 'Código',
          placeholder: 'Código'
        },
        {
          id: 'desc',
          type: 'text',
          name: 'desc',
          label: 'Descrição',
          placeholder: 'Descrição'
        }
      ],
      buttons: [
        {
          text: 'Cadastrar',
          cssClass: 'primary',
          handler: (data) => {            
              let code = data.code.toLowerCase().toUpperCase();
              let desc = data.desc.toLowerCase().toUpperCase();

              if (code && desc != '') {
                let found = this.itens.find((ret) => ret.desc === desc);
                
                if(found){
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
                  this.auth.create_medidas(code, desc, this.key_loja);
                }
                

              } else {
                this.loadCtrl.dismiss();
                this.alertCtrl.create({
                  header: 'Aviso!',
                  message: 'Há algum campo vazio, preencha-o.',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alert) => {
                  alert.present();
                })
              }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
        }
      ]
    }).then((alert) => alert.present());

  }

  unread(item) {
    this.alertCtrl.create({
      header: 'Editar Medidas',
      inputs: [
        {
          id: 'code',
          type: 'text',
          name: 'code',
          value: item.code,
          placeholder: 'Código'
        },
        {
          id: 'desc',
          type: 'text',
          name: 'desc',
          value: item.desc,
          placeholder: 'Descrição'
        }
      ],
      buttons: [
        {
          text: 'Atualizar',
          cssClass: 'primary',
          handler: (data) => {
            this.loadCtrl.create({
              message: 'Atualizando...'
            }).then((load) => {
              load.present();
              let code = data.code.toLowerCase().toUpperCase();
              let desc = data.desc.toLowerCase().toUpperCase();

              if (code && desc != '') {
                this.auth.update_medidas(code, desc, item.key);
              } else {
                this.loadCtrl.dismiss();
                this.alertCtrl.create({
                  header: 'Aviso!',
                  message: 'Há algum campo vazio, preencha-o.',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alert) => {
                  alert.present();
                })
              }
            })

          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
        }
      ]
    }).then((alert) => alert.present());

  }

  share(item) {
    this.alertCtrl.create({
      header: 'Aviso!',
      message: `Você deseja excluir a medida ${item.desc}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.delete_medida(item.key)
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => alert.present())
  }

}
