import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthService } from 'src/app/providers/auth.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {
  signupForm: FormGroup;
  public logomarca: string;
  public arquivo: any = '';
  public key_loja: any = '';
  constructor(public formBuilder: FormBuilder, private toast: ToastController, private loadCtrl: LoadingController, private route: Router, private actionCtrl: ActionSheetController, private camera: Camera, public auth: AuthService) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      nome_loja: ['', [Validators.required, Validators.minLength(3)]],
      email_loja: ['', Validators.compose([Validators.pattern(emailRegex)])],
      contato_principal: [''],
      contato_secundario: [''],
      whatsapp_loja: ['']
    });
  }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Aguarde...'
    }).then((load) => {
      load.present();
      this.auth.getUserByUid().valueChanges().subscribe((data: any) => {
        this.auth.getLojaByKey(data.key_loja).valueChanges().subscribe((data2: any) => {
          this.signupForm.get('nome_loja').setValue(data2.nome_loja);
          this.key_loja = data2.key;
          this.loadCtrl.dismiss();
        })
      })
    }) 
  }

  logo(): void {
    this.actionCtrl.create({
      header: 'Adicionar Logomarca',
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

  upload(action: string) {
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

        let upload = this.auth.upload(this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.logomarca = img_path;
            load.dismiss();
            this.toast.create({
              message: 'Logomarca adicionada',
              duration: 3000,
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

  alert() {
    let form = this.signupForm.value;

    if (form.contato_principal != '' || form.contato_secundario != '') {
      this.actionCtrl.create({
        header: 'Deseja copiar o WhatsApp do?',
        buttons: [
          {
            text: 'Contato Principal',
            icon: 'call',
            handler: () => {
              let form = this.signupForm.value;
              this.signupForm.get('whatsapp_loja').setValue(form.contato_principal);

            }
          },
          {
            text: 'Contato Secundário',
            icon: 'call',
            handler: () => {
              let form = this.signupForm.value;
              this.signupForm.get('whatsapp_loja').setValue(form.contato_secundario);
            }
          },
          {
            text: 'Nenhum',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              let form = this.signupForm.value;
              this.signupForm.get('whatsapp_loja').setValue('');
              this.signupForm.get('whatsapp_loja').disabled;
            }
          }
        ]
      }).then((action) => {
        action.present()
      })
    }
  }

  submit() {
    this.loadCtrl.create({
      message: 'Configurando...'
    }).then((load) => {
      load.present();
      let form = this.signupForm.value;
      form.key = this.key_loja;
      this.auth.config_loja(this.arquivo, form);
    })

  }

}