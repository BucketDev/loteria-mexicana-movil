import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {FireAuthService} from './security/fire-auth.service';
import {User as FireBaseUser} from 'firebase';
import {UsersService} from './users.service';
import {LotteryUser} from '../models/lottery-user.class';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(private afMessaging: AngularFireMessaging,
              private usersService: UsersService,
              private toastController: ToastController) {
    afMessaging.messaging.subscribe(messaging => {
      messaging.onMessage.bind(messaging);
    });
  }

  getPermission() {
    this.afMessaging.requestPermission.toPromise()
      .then(() => {
        this.afMessaging.getToken.subscribe((token: string) => {
          if (token) {
            this.saveToken(token);
          }
        }, error => console.error('Unable to get token', error));
      })
      .catch(error => console.error('Permission denied!', error));
  }

  monitorRefresh = () => {
    this.afMessaging.tokenChanges.subscribe(() => {
      this.afMessaging.getToken.subscribe((token: string) => {
        if (token) {
          this.saveToken(token);
        }
      }, error => console.error(error, 'Unable to get token'));
    });
  }

  saveToken = (token: string) => {
    this.usersService.find().toPromise()
      .then(async (lotteryUser: LotteryUser) => {
        const currentTokens = lotteryUser.fcmTokens || {};
        if (!currentTokens[token]) {
          this.usersService.updateFCMToken({...currentTokens, [token]: true})
            .catch(console.error);
        }
      })
      .catch(console.error);
  }

  receiveMessages = () => {
    this.afMessaging.messages.subscribe((payload) => {
      console.log('new message received. ', payload);
      this.currentMessage.next(payload);
    });
  }
}
