import { Component, OnInit } from '@angular/core';
import {Notification} from "../../models/notification.class";
import {NavController, PopoverController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.scss'],
})
export class NotificationPopoverComponent implements OnInit {

  notifications: Notification[] = [];
  loading =  true;

  constructor(private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private notificationsService: NotificationsService,
              private popoverController: PopoverController) {
    notificationsService.getLast().subscribe((notifications: Notification[]) => {
      this.loading = false;
      this.notifications = notifications;
    });
  }

  ngOnInit() {}

  navigate = (notification: Notification) => {
    console.log(notification.actionURL)
    this.popoverController.dismiss()
      .then(() => this.navController.navigateForward([notification.actionURL]))
  }

}
