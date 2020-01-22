import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
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
        this.getCategoriasLoja(this.key_loja);
      }, (err) => {
        load.dismiss();
      })
    })
  }

  getCategoriasLoja(loja){
   this.auth.getCategoriasLoja(loja).subscribe((data: any) => {
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
        return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.itens = this.allItens;
    }
  }

  add() {
    this.alertCtrl.create({
      header: 'Adicionar Categorias',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          placeholder: 'Nome da Categoria'
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
            let desc = data.desc.toLowerCase().toUpperCase();

            if (nome && desc != '') {
              let found = this.itens.find((ret) => ret.nome === nome);

              if (found) {
                this.alertCtrl.create({
                  header: 'Erro!',
                  message: 'Categoria já cadastrada',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alt) => {
                  this.loadCtrl.dismiss();
                  alt.present();
                })
              } else {
                this.auth.create_categorias(nome, desc, this.key_loja);
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
      header: 'Editar Categorias',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          value: item.nome,
          placeholder: 'Nome da Categoria'
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
            let desc = data.desc.toLowerCase().toUpperCase();

            if (nome && desc != '') {
              let found = this.itens.find((ret) => ret.nome === nome);

              if (found) {
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
                this.auth.update_categorias(nome, desc, item.key);
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
      message: `Você deseja excluir a categoria ${item.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.delete_item('categorias', item.key);
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
