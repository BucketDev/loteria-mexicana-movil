import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
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
      this.initializeApp();
      this.loading = false;
      if (userExists && this.platform.is('capacitor')) {
        this.messagingService.getPermission();
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
