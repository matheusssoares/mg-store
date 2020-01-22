import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.page.html',
  styleUrls: ['./departamentos.page.scss'],
})
export class DepartamentosPage implements OnInit {
  public itens = [];
  public key_loja: string;
  public allItens: any;

  constructor(private auth: AuthService, private loadCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Aguarde...'
    }).then((load) => {
      load.present();
      this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
        this.key_loja = data.key_loja;
        this.getDepartamentosLoja(this.key_loja);
      }, (err) => {
        load.dismiss();
      })
    })
  }

  getDepartamentosLoja(loja) {
    this.auth.getDepartamentosLoja(loja).subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;
      this.loadCtrl.dismiss();
    })

  }

  filter(item: any) {
    let val = item.target.value;

    if (val && val.trim() != '') {
      this.itens = this.allItens;
      this.itens = this.itens.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.itens = this.allItens;
    }
  }

  add() {
    this.alertCtrl.create({
      header: 'Adicionar Departamentos',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          placeholder: 'Nome do departamento'
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
            let nome = data.nome.toLowerCase().toUpperCase();
            let desc = data.desc.toLowerCase();

            if (nome && desc != '') {
              let found = this.itens.find((ret) => ret.nome === nome);

              if (found) {
                this.alertCtrl.create({
                  header: 'Erro!',
                  message: 'Departamento já cadastrado',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alt) => {
                  this.loadCtrl.dismiss();
                  alt.present();
                })
              } else {
                this.auth.create_departamentos(nome, desc, this.key_loja);
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
      header: 'Editar Departamentos',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          value: item.nome,
          placeholder: 'Nome do departamento'
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
            let nome = data.nome.toLowerCase().toUpperCase();
            let desc = data.desc.toLowerCase();

            if (nome && desc != '') {
              let found = this.itens.find((ret) => ret.nome === nome);

              if (found) {
                this.alertCtrl.create({
                  header: 'Erro!',
                  message: 'Departamento já cadastrado',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alt) => {
                  alt.present();
                })
              } else {
                this.auth.update_departamentos(nome, desc, item.key);
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

  share(item) {
    this.alertCtrl.create({
      header: 'Aviso!',
      message: `Você deseja excluir o departamento ${item.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.delete_item('departamentos', item.key);
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
