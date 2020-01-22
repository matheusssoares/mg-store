import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as cep from 'cep-promise';
import { AuthService } from 'src/app/providers/auth.service';
import { SMS } from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
})
export class AdicionarPage implements OnInit {
  valor_debito_antigo: any;
  signupForm: FormGroup;
  display_end: boolean = false;
  display_doc: boolean = false;
  display_config: boolean = false;
  mostrar_cep: boolean = true;
  end: any = {
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    comp: '',
    num: ''
  }

  doc: any = {
    rg: '',
    cpf: '',
    data_nasc: ''
  }
  novo_valor_credito: any;
  credito: number = 0;
  config: any = {
    debito_antigo: false,
    salvar_contato: false,
    enviar_msg: false
  }
  constructor(private sms: SMS, private auth: AuthService, public formBuilder: FormBuilder, public actionCtrl: ActionSheetController, private loadCtrl: LoadingController, public toast: ToastController, public alertCtrl: AlertController) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      nome_cliente: ['', [Validators.required, Validators.minLength(3)]],
      email_cliente: ['', Validators.compose([Validators.pattern(emailRegex)])],
      whatsapp_cliente: [''],
      sexo_cliente: [''],
    });
  }

  ngOnInit() {
    this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
      let key = data.key_loja;
      this.auth.getLojaByKey(key).valueChanges().subscribe((ret: any) => {
        this.credito = ret.limite_credito;
      })
      
      
    }, (err) => {
      console.log(err);
      
    })
  }

  valor_credito(){
    this.alertCtrl.create({
      header: 'Valor de crédito',
      inputs: [
        {
          name: 'valor_credito',
          type: 'text',
          placeholder: 'Adicionar novo valor',
        }
      ],
      buttons: [
        {
          text: 'Confirmar',
          handler: (data) => {
            this.novo_valor_credito = data.valor_credito.toString().replace(",", ".");
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((a) => a.present())
  }

  mostrar_end() {
    this.display_end = true;
  }
  esconder_end() {
    this.display_end = false;
  }

  mostrar_doc() {
    this.display_doc = true;
  }
  esconder_doc() {
    this.display_doc = false;
  }

  mostrar_config() {
    this.display_config = true;
  }
  esconder_config() {
    this.display_config = false;
  }

  foto() {
    this.actionCtrl.create({
      header: 'Adicionar Foto',
      buttons: [
        {
          text: 'Tirar Foto',
          icon: 'camera',
          handler: () => {
            this.upload('tirar_foto');
          }
        },

        {
          text: 'Escolher foto',
          icon: 'image',
          handler: () => {
            this.upload('escolher_foto');
          }
        }
      ]
    }).then((action) => {
      action.present();
    })
  }
  upload(action) {

  }

  getCep(value) {
    if (value.length >= 9) {

      this.loadCtrl.create({
        message: 'Buscando endereço...'
      }).then((load) => {
        load.present();
        cep(value).then((data) => {
          this.end.cep = data.cep;
          this.end.estado = data.state;
          this.end.cidade = data.city;
          this.end.bairro = data.neighborhood;
          this.end.rua = data.street;
          this.mostrar_cep = false;
          load.dismiss();
        }).catch((err) => {
          console.log(err);
          load.dismiss();
          this.toast.create({
            message: 'Não encontramos este CEP',
            duration: 3000,
            color: 'danger'
          }).then((toast) => {
            toast.present();
          })
        })
      })
    }

  }

  enviar_msg(){
    console.log('chegamos aqui');
    this.sms.send('5591988859681', 'Hello world!');
  }
}