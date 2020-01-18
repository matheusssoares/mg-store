import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-cadastre-se',
  templateUrl: './cadastre-se.page.html',
  styleUrls: ['./cadastre-se.page.scss'],
})
export class CadastreSePage implements OnInit {
  signupForm: FormGroup;

  constructor(private alertCtrl: AlertController, private toast: ToastController, public authService: AuthService, public formBuilder: FormBuilder, private loadCtrl: LoadingController, private navCtrl: NavController) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      nome_loja: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }

  voltar() {
    this.navCtrl.navigateBack('');
  }

  onSubmit(): void {
    this.loadCtrl.create({
      message: 'Criando conta, aguarde...'
    }).then((load) => {
      load.present();
      let form = this.signupForm.value;
      this.authService.cadastrar_loja(form);
    })
  }

}
