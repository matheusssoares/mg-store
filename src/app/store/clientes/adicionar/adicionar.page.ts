import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as cep from 'cep-promise';
import { AuthService } from 'src/app/providers/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ClientesService } from 'src/app/providers/clientes.service';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
})
export class AdicionarPage implements OnInit {
  cliente: any = {};
  informacao_debito_antigo: string;
  key_loja: string;
  public foto_cli: string;
  public arquivo: any = '';
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
    data_nasc: '',
    valor_credito: 0
  }
  novo_valor_credito: any;
  credito: number = 0;
  config: any = {
    debito_antigo: false,
    salvar_contato: false,
    enviar_msg: false
  }
  constructor(private clienteService: ClientesService, private camera: Camera, private socialSharing: SocialSharing, private auth: AuthService, public formBuilder: FormBuilder, public actionCtrl: ActionSheetController, private loadCtrl: LoadingController, public toast: ToastController, public alertCtrl: AlertController) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.pattern(emailRegex),])],
      whatsapp: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
      this.key_loja = data.key_loja;
      this.auth.getLojaByKey(this.key_loja).valueChanges().subscribe((ret: any) => {
        this.credito = ret.limite_credito;
      })


    }, (err) => {
      console.log(err);

    })
  }

  valor_credito() {
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
    if (action === 'tirar_foto') {
      var options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
    } else {
      var options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loadCtrl.create({
        message: 'Carregando imagem...'
      }).then((load) => {
        load.present();
        this.arquivo = 'data:image/jpeg;base64,' + imageData;

        let upload = this.auth.upload_arquivo('store', 'clientes', 'foto.jpg', this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.foto_cli = img_path;
            load.dismiss();
            this.toast.create({
              message: 'Foto adicionada',
              duration: 2000,
              color: 'dark'
            }).then((toast) => {
              toast.present();
            })
          })

        }).catch((err) => {
          console.log(err);
          load.dismiss();

        })


      })
    }).catch((err) => {
      console.log(err);
      this.toast.create({
        message: 'Função não suportada neste dispositivo.',
        duration: 3000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      })

    })
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

  enviar_msg() {
    //WhatsApp enviar para um número específico
    this.socialSharing.shareViaWhatsAppToReceiver('+5591984299647', 'Esta é uma mensagem automática enviada via MG Store!', null, 'www.google.com').then(() => {
      console.log('Enviada');

    }).catch((e) => {
      console.log(e);

    })
    //whatsapp selecionar número
    /* this.socialSharing.shareViaWhatsApp('Olá mundo!').then(() => {
      console.log('ok');
      
    }).catch((e) => {
      console.log(e);
      
    }) */
    //sms
    /* console.log('chegamos aqui');
    var options = {
      replaceLineBreaks: false,
      android: {
          intent: 'INTENT'
      }
  };

    this.sms.send('5591988859681', 'bem-vindo!', options).then(() => {
      console.log('enviado sms');
      
    }).catch((err) => {
      console.log(err)
      
    }) */
  }

  onSubmit(signupForm) {
    this.loadCtrl.create({
      message: 'Cadastrando, aguarde...'
    }).then((l) => {
      l.present();
      this.cliente.key = this.auth.gerarKey();
      if (this.arquivo) {
        console.log('fazendo upload de imagem');
        this.auth.upload_arquivo('clientes', 'foto-cliente', `${this.cliente.key}.jpg`, this.arquivo)
          .then((snapshot) => {
            snapshot.ref.getDownloadURL().then((img) => {
              this.cliente.foto_perfil = img;
              this.cliente.nome = signupForm.value.nome;
              this.cliente.email = signupForm.value.email;
              this.cliente.whatsapp = signupForm.value.whatsapp;
              this.cliente.sexo = signupForm.value.sexo;

              this.cliente.cep = this.end.cep;
              this.cliente.estado = this.end.estado;
              this.cliente.cidade = this.end.cidade;
              this.cliente.bairro = this.end.bairro;
              this.cliente.rua = this.end.rua;
              this.cliente.comp = this.end.comp;
              this.cliente.num = this.end.num;

              this.cliente.rg = this.doc.rg;
              this.cliente.cpf = this.doc.cpf;
              this.cliente.data_nasc = this.doc.data_nasc;

              if (this.doc.valor_credito == "1") {
                this.cliente.limite_credito = this.credito;
              } else if (this.doc.valor_credito == "2") {
                this.cliente.limite_credito = 0;
              } else {
                this.cliente.limite_credito = +this.novo_valor_credito;
              }

              if (this.config.debito_antigo) {
                this.cliente.valor_debito_antigo = +this.valor_debito_antigo;
                this.cliente.informacao_debito_antigo = this.informacao_debito_antigo;
              }

              this.cliente.key_loja = this.key_loja;

              this.cliente.salvar_contato = this.config.salvar_contato;
              this.cliente.mandar_msg = this.config.enviar_msg;

              this.clienteService.create_registro('clientes', this.cliente);
            })
          })

      } else {
        this.cliente.nome = signupForm.value.nome;
        this.cliente.email = signupForm.value.email;
        this.cliente.whatsapp = signupForm.value.whatsapp;
        this.cliente.sexo = signupForm.value.sexo;

        this.cliente.cep = this.end.cep;
        this.cliente.estado = this.end.estado;
        this.cliente.cidade = this.end.cidade;
        this.cliente.bairro = this.end.bairro;
        this.cliente.rua = this.end.rua;
        this.cliente.comp = this.end.comp;
        this.cliente.num = this.end.num;

        this.cliente.rg = this.doc.rg;
        this.cliente.cpf = this.doc.cpf;
        this.cliente.data_nasc = this.doc.data_nasc;

        if (this.doc.valor_credito == "1") {
          this.cliente.limite_credito = this.credito;
        } else if (this.doc.valor_credito == "2") {
          this.cliente.limite_credito = 0;
        } else {
          this.cliente.limite_credito = +this.novo_valor_credito;
        }

        if (this.config.debito_antigo) {
          this.cliente.valor_debito_antigo = +this.valor_debito_antigo;
          this.cliente.informacao_debito_antigo = this.informacao_debito_antigo;
        }

        this.cliente.key_loja = this.key_loja;

        this.cliente.salvar_contato = this.config.salvar_contato;
        this.cliente.mandar_msg = this.config.enviar_msg;

        this.clienteService.create_registro('clientes', this.cliente);
      }

    })

  }

  radioGroupChange(event) {
    this.doc.valor_credito = event.detail.value
  }

  tem_debito(event) {
    this.config.debito_antigo = event.detail.checked;

  }

  
}