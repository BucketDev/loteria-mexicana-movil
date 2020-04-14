import { Component, OnInit } from '@angular/core';
import {FireAuthService} from '../../services/security/fire-auth.service';
import {MenuController, NavController} from '@ionic/angular';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(public fireAuth: FireAuthService,
              private navController: NavController,
              private menuController: MenuController,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

  showProfilePage = () => this.navController
    .navigateForward(['../profile', this.fireAuth.lotteryUser.uid],
      { relativeTo: this.activatedRoute }).then(() => this.menuController.close())

  signOut = () => this.fireAuth.signOut().then(() => this.menuController.close());

  showFriends = () => {
    this.navController.navigateForward(['/friends'])
      .then(() => this.menuController.close())
      .catch();
  }

}
