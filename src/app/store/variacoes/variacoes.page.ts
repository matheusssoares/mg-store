import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-variacoes',
  templateUrl: './variacoes.page.html',
  styleUrls: ['./variacoes.page.scss'],
})
export class VariacoesPage implements OnInit {
  public nome: any;
  public key:any;
  public itens: any = [];
  public key_loja: any;;
  constructor(private route: ActivatedRoute, private auth: AuthService, private alertCtrl: AlertController) { 
    
  }

  ngOnInit() {
    this.key = this.route.snapshot.paramMap.get('key');    
    this.auth.getGrade(this.key).valueChanges().subscribe((data: any) => {
      data.forEach(element => {
        this.nome = element.nome;   
        this.key_loja = element.key_loja;     
      });
      
    })

    this.getVariacoes(this.key);
  }

  getVariacoes(key){
    this.auth.getVariacoes(key).valueChanges().subscribe((data: any) => {
      this.itens = data;
    })
  }

  excluir(item) {
    this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Você deseja excluir esta variação?',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.auth.delete_item('variacoes', item.key);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((a) => a.present())
  }

  add() {
    this.alertCtrl.create({
      header: 'Adicionar Variação',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          placeholder: 'Nome da variação'
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
                  message: 'Variação já cadastrada',
                  buttons: [{
                    text: 'Entendi'
                  }]
                }).then((alt) => {
                  alt.present();
                })
              } else {
                this.auth.create_variacao(nome, this.key, this.key_loja);
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

}
