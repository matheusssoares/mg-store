import { Component, OnInit } from '@angular/core';
import { LottieAnimationViewModule } from 'ng-lottie';
import * as cep from 'cep-promise';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.page.html',
  styleUrls: ['./endereco.page.scss'],
})
export class EnderecoPage implements OnInit {
  lottieConfig: any;
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
  data: any;
  constructor(private route: ActivatedRoute, public auth: AuthService, private loadCtrl: LoadingController, private router: Router, public toast: ToastController) {
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'https://assets4.lottiefiles.com/datafiles/uihIaQIvWBfYL9a/data.json',
      autoplay: true,
      loop: true
    };

    let id = this.route.snapshot.paramMap.get('key');

    this.data = id;
    
  }

  ngOnInit() {
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

  Continuar(end: any) {
    end.key = this.data;

    this.loadCtrl.create({
      message: 'Cadastrando endereço',
    }).then((load) => {
      load.present();
      this.auth.update('lojas', end);
    })
    
  }

}
