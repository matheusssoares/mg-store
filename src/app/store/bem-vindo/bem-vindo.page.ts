import { Component, OnInit } from '@angular/core';
import { LottieAnimationViewModule } from 'ng-lottie';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-bem-vindo',
  templateUrl: './bem-vindo.page.html',
  styleUrls: ['./bem-vindo.page.scss'],
})
export class BemVindoPage implements OnInit {
  public lottieConfig: any;
  public nome: string;
  constructor(private menuCtrl: MenuController, private route: Router, private auth: AuthService) {
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'https://assets9.lottiefiles.com/packages/lf20_ybDCvD.json',
      autoplay: true,
      loop: true
    };
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
     this.auth.getUserNome(this.auth.getUserLogged().uid).valueChanges().subscribe((data: any) => {
      this.nome = data.nome;
      var ret = this.nome.split(' ');
      this.nome = ret.shift();

    })
  }

  Continuar(): void {
    this.route.navigateByUrl('store/configuracoes');
  }

}
