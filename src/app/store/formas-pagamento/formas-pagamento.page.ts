import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.page.html',
  styleUrls: ['./formas-pagamento.page.scss'],
})
export class FormasPagamentoPage implements OnInit {
  itens: any;
  Allformas: any;
  key_loja: string;
  array_loja: Array<any>;
  array_padrao: Array<any>;
  constructor(private auth: AuthService, private loadCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Aguarde...'
    }).then((load) => {
      load.present();
      this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
        this.key_loja = data.key_loja;
        this.getFormasLoja(this.key_loja);
      }, (err) => {
        console.log(err);
      })
    })
  }

  getFormasLoja(key_loja){
    this.auth.getFormasByLoja(key_loja).valueChanges().subscribe((data: any) => {
      this.array_loja = data;

      this.getFormasPadrao();
    }, (err) => {
      this.loadCtrl.dismiss();

    });
  }

  getFormasPadrao() {
    this.auth.getFormaspadrao().valueChanges().subscribe((data: any) => {
      this.array_padrao = data;

      var i: Array<any> = this.array_loja.concat(this.array_padrao);

      this.itens = i.sort((a, b) => a.desc.localeCompare(b.desc));

      this.Allformas = this.itens;

      this.loadCtrl.dismiss();

    }, (err) => {
      this.loadCtrl.dismiss();
      console.log(err);

    })
  }

  add() {
    this.alertCtrl.create({
      header: 'Forma de pagamento',
      inputs: [
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
              let desc = data.desc.toLowerCase().toUpperCase();

              if (desc && desc != '') {
                let found = this.itens.find((ret) => ret.desc === desc);
                
                if(found){
                  this.alertCtrl.create({
                    header: 'Erro!',
                    message: 'Forma de pagamento já cadastrada',
                    buttons: [{
                      text: 'Entendi'
                    }]
                  }).then((alt) => {
                    alt.present();
                  })
                } else {
                  this.auth.create_formas(desc, this.key_loja);
                }
                

              } else {
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
      header: 'Editar Forma',
      inputs: [
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
              let desc = data.desc.toLowerCase().toUpperCase();

              if (desc && desc != '') {
                this.auth.update_formas(desc, item.key);
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
      message: `Você deseja excluir a forma ${item.desc}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.delete_item('formas-pagamento', item.key)
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => alert.present())
  }

  filter(item: any) {
    let val = item.target.value;

    if (val && val.trim() != '') {
      this.itens = this.Allformas;
      this.itens = this.itens.filter((item) => {
        return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.itens = this.Allformas;
    }
  }

}
