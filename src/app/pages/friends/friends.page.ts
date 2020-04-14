import { Component } from '@angular/core';
import {FriendsService} from '../../services/friends.service';
import {Observable} from 'rxjs';
import {LotteryUser} from '../../models/lottery-user.class';
import {ModalController} from '@ionic/angular';
import {NewFriendPage} from '../modal/new-friend/new-friend.page';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss']
})
export class FriendsPage {

  loadedFriends: LotteryUser[];

  constructor(private friendsService: FriendsService,
              private modalController: ModalController) {}

  deleteFriend = console.log;

  setFriends(friends: LotteryUser[]) {
    this.loadedFriends = friends;
  }

  showModalUsers = async () => {
    const modal = await this.modalController.create({
      component: NewFriendPage,
      componentProps: {
        friends: this.loadedFriends
      }
    });
    await modal.present();
  }

}
