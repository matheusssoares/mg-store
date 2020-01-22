import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.page.html',
  styleUrls: ['./grades.page.scss'],
})
export class GradesPage implements OnInit {
  public itens = [];
  public key_loja: string;
  public allItens: any;

  constructor(private route: Router, private auth: AuthService, private loadCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Aguarde...'
    }).then((load) => {
      load.present();
      this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
        this.key_loja = data.key_loja;
        this.getGradesLoja(this.key_loja);
      }, (err) => {
        load.dismiss();
      })
    })
  }

  getGradesLoja(loja) {
    this.auth.getGradesLoja(loja).subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;
      this.loadCtrl.dismiss();
    })

  }

  add() {
    this.alertCtrl.create({
      header: 'Adicionar Grades',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          placeholder: 'Nome da grade'
        }
      ],
      buttons: [
        {
          text: 'Cadastrar',
          cssClass: 'primary',
          handler: (data) => {
            let nome = data.nome.toLowerCase().toUpperCase();

            if (nome && nome != '') {
              let found = this.itens.find((ret) => ret.nome === nome);

              if (found) {
                this.alertCtrl.create({
                  header: 'Erro!',
                  message: 'Grade já cadastrada',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alt) => {
                  this.loadCtrl.dismiss();
                  alt.present();
                })
              } else {
                this.auth.create_grade(nome, this.key_loja);
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

  excluir(item) {
    this.alertCtrl.create({
      header: 'Aviso!',
      message: `Você deseja excluir a grade ${item.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.delete_item('grades', item.key);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => alert.present())
  }

  variacoes(item){
    console.log(item);    
    this.route.navigateByUrl(`store/app/cadastros/grades/variacoes/${item.key}`);
  }

}
