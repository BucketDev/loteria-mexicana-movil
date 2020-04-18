import { Component, OnInit } from '@angular/core';
import {FireAuthService} from '../../../services/security/fire-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signIn = true;

  constructor(private auth: FireAuthService) { }

  ngOnInit() {
  }

  googleLogin = () => this.auth.googleLogin();

  facebookLogin = () => this.auth.facebookLogin();

}
