import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  signupForm: FormGroup;
  lottieConfig: any;
  constructor(private auth: AuthService, private load: LoadingController, public formBuilder: FormBuilder, private menuCtrl: MenuController, private router: Router) {
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'https://assets4.lottiefiles.com/datafiles/uihIaQIvWBfYL9a/data.json',
      autoplay: true,
      loop: true
    };

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  /* login(): void {
    this.router.navigateByUrl('adm/dashboard');
  } */
  cadastrar(): void {
    this.router.navigateByUrl('cadastre-se');
  }

  onSubmit() {
    let form = this.signupForm.value;
    this.load.create({
      message: 'Autenticando, aguarde...'
    }).then((load) => {
      load.present();
      this.auth.login(form);
    })
  }

}
