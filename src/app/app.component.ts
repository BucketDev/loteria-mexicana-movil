import { Component } from '@angular/core';

import {Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FireAuthService} from './services/security/fire-auth.service';
import {MessagingService} from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  loading = true;

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private fireAuth: FireAuthService,
              private messagingService: MessagingService) {
    this.fireAuth.$userRetrieved.subscribe((userExists: boolean) => {
      // this.showNavbar = value;
      this.initializeApp();
      this.loading = false;
      if (userExists) {
        this.messagingService.getPermission();
        this.messagingService.monitorRefresh();
        this.messagingService.receiveMessages();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
