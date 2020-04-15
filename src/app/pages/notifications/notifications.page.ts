import {Component, OnInit, ViewChild} from '@angular/core';
import {Notification} from "../../models/notification.class";
import {NotificationsService} from "../../services/notifications.service";
import {QueryDocumentSnapshot, QuerySnapshot} from "@angular/fire/firestore";
import {IonInfiniteScroll, NavController, ToastController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Notification[];
  notificationsDoc: QueryDocumentSnapshot<Notification>[];
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  loading = true;

  constructor(private notificationsService: NotificationsService,
              private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private toastController: ToastController) { }

  getLast = (event?) => {
    this.notificationsService.getLast().toPromise()
      .then((notifications: QuerySnapshot<Notification>) => {
        this.notificationsDoc = notifications.docs;
        this.notifications = notifications.docs.map((notificationDoc: QueryDocumentSnapshot<Notification>) => {
          const notification: Notification = notificationDoc.data();
          return {...notification, uid: notificationDoc.id};
        });
        if (event) {
          event.target.complete();
          this.infiniteScroll.disabled = false;
        }
        this.loading = false;
      });
  }
  getNext = (event) => {
    const lastNotification = this.notificationsDoc[this.notificationsDoc.length - 1];
    this.notificationsService.getNext(lastNotification).toPromise()
      .then((notifications: QuerySnapshot<Notification>) => {
        event.target.complete();
        if (notifications.docs.length === 0) {
          this.infiniteScroll.disabled = true;
        } else {
          this.notificationsDoc = notifications.docs;
          this.notifications.push(...notifications.docs.map((notificationDoc: QueryDocumentSnapshot<Notification>) => {
            const notification: Notification = notificationDoc.data();
            return {...notification, uid: notificationDoc.id};
          }));
        }
        this.loading = false;
      })
  }

  ngOnInit() {
    this.getLast();
  }

  readNotification = (notification: Notification) => {
    this.navController.navigateForward(notification.actionURL, { relativeTo: this.activatedRoute })
      .then(() => {
        if (!notification.clicked) {
          this.notificationsService.markRead(notification.uid)
            .then(() => notification.clicked = true);
        }
      })
  }

  readAllNotifications = () => this.notificationsService.markAllRead().toPromise()
    .then(() => {
      this.toastController.create({
        message: 'Todas las invitaciones han sido marcadas como leídas',
        duration: 3000
      }).then(toast => {
        this.notifications.forEach(notification => notification.clicked = true);
        toast.present();
      });
    });

}
