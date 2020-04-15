import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {UsersService} from './users.service';
import {LotteryUser} from '../models/lottery-user.class';
import {AlertController, NavController, ToastController} from '@ionic/angular';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed} from '@capacitor/core';

const { PushNotifications, Modals } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(private usersService: UsersService,
              private toastController: ToastController,
              private alertController: AlertController,
              private navController: NavController) { }

  getPermission() {

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On succcess, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => this.saveToken(token.value));

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        this.toastController.create({
          message: 'Ocurrió un erro al registrar el dispositivo, intentalo mas tarde',
          color: 'danger',
          duration: 3000
        }).then(toast => toast.present())
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        this.toastController.create({
          message: notification.body,
          buttons: [{
            text: 'Jugar',
            side: 'end',
            handler: () => {
              const {userUid, boardUid} = notification.notification.data;
              this.showBoard(userUid, boardUid);
            }
          }]
        }).then(toast => toast.present());
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
      const {userUid, boardUid} = notification.notification.data;
      await this.showBoard(userUid, boardUid);
    });

  }

  saveToken = (token: string) => {
    this.usersService.find().subscribe(async (lotteryUser: LotteryUser) => {
      const currentTokens = lotteryUser.fcmTokens || {};
      if (!currentTokens[token]) {
        this.usersService.updateFCMToken({...currentTokens, [token]: true})
          .catch(console.error);
      }
    });
  }

  showBoard = (userUid: string, boardUid: string) => this.navController.navigateForward(`/board/${userUid}/${boardUid}`);
}
