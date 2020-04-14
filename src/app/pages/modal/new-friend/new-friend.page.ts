import {Component, Input, OnInit} from '@angular/core';
import {LotteryUser} from '../../../models/lottery-user.class';
import {UsersService} from '../../../services/users.service';
import {FriendsService} from '../../../services/friends.service';
import {ModalController, ToastController} from '@ionic/angular';
import {FriendLotteryUser} from '../../../models/friend-lottery-user.class';
import {FireAuthService} from "../../../services/security/fire-auth.service";

@Component({
  selector: 'app-new-friend',
  templateUrl: './new-friend.page.html',
  styleUrls: ['./new-friend.page.scss'],
})
export class NewFriendPage implements OnInit {

  users: FriendLotteryUser[] = [];
  @Input() friends: FriendLotteryUser[];
  loading = false;

  constructor(private usersService: UsersService,
              private friendsService: FriendsService,
              private modalController: ModalController,
              private toastController: ToastController,
              public fireAuth: FireAuthService) { }

  ngOnInit() { }

  updateTextSearch = (event: CustomEvent) => {
    const text = event.detail.value;
    if (text !== '' && text.length > 3) {
      this.loading = true;
      this.usersService.findUsersByDisplayNameAndEmail(text.toLowerCase()).subscribe((users: FriendLotteryUser[]) => {
        this.users = users.map((user: FriendLotteryUser) => {
          if (this.friends.find((friend: FriendLotteryUser) => friend.uid === user.uid)) {
            user.isFriend = true;
          }
          return user;
        });
        this.loading = false;
      });
    } else {
      this.users = [];
    }
  }

  addFriend = (user: FriendLotteryUser) => this.friendsService.addFriend(user).then(() => {
    user.isFriend = true;
    this.toastController.create({
      message: `${user.displayName} fue añadido a tu lista de amigos`,
      duration: 2000
    }).then((toast) => toast.present());
  })

  hideModalUsers = async () => await this.modalController.dismiss();

}
