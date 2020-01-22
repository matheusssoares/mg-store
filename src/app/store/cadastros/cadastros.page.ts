import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.page.html',
  styleUrls: ['./cadastros.page.scss'],
})
export class CadastrosPage implements OnInit {

  constructor(private auth: AuthService, private route: Router) { }

  ngOnInit() {

  }

  navegar(page) {
    this.route.navigateByUrl(`store/app/cadastros/${page}`);

  }

}
