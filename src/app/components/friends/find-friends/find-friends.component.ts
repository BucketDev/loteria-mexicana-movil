import {Component, Input, OnInit} from '@angular/core';
import {FriendLotteryUser} from "../../../models/friend-lottery-user.class";
import {UsersService} from "../../../services/users.service";
import {FriendsService} from "../../../services/friends.service";
import {ToastController} from "@ionic/angular";
import {FireAuthService} from "../../../services/security/fire-auth.service";

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss'],
})
export class FindFriendsComponent implements OnInit {

  loading: boolean;
  users: FriendLotteryUser[] = [];
  @Input() friends: FriendLotteryUser[] = [];

  constructor(private usersService: UsersService,
              private friendsService: FriendsService,
              private toastController: ToastController,
              public fireAuth: FireAuthService) { }

  ngOnInit() {}

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

}
