import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {LotteryUser} from '../../models/lottery-user.class';
import {FriendsService} from '../../services/friends.service';
import {IonCheckbox, NavController, ToastController} from '@ionic/angular';
import {UsersService} from "../../services/users.service";
import {DocumentSnapshot} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {

  loading = true;
  user: LotteryUser;
  selectedFriends: LotteryUser[] = [];
  @Output() friendsLoaded = new EventEmitter<LotteryUser[]>();
  @Input() players: LotteryUser[];
  @Input() deletableFriend = false;
  @Input() selectableFriend = true;
  @ViewChildren(IonCheckbox) friendsCheckBox: QueryList<IonCheckbox>;

  constructor(private friendsService: FriendsService,
              private usersService: UsersService,
              private toastController: ToastController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute) {
    usersService.find().subscribe((user: LotteryUser) => {
      this.user = user;
      this.user.friends = [];
      if (this.players) {
        this.user.friendsRef = this.user.friendsRef.filter(friendRef =>
          !this.players.find(player => player.uid === friendRef.id));
      }
      user.friendsRef.forEach(async friendRef => {
        const friendSnap: DocumentSnapshot<LotteryUser> = await friendRef.get() as DocumentSnapshot<LotteryUser>;
        const friend = friendSnap.data();
        this.user.friends.push({...friend, uid: friendSnap.id });
        this.friendsLoaded.emit(this.user.friends);
      })
      this.loading = false;
    });
  }

  ngOnInit() { }

  deleteFriend = (user: LotteryUser) =>
    this.friendsService.deleteFriend(user).then(() => {
      this.toastController.create({
        message: `${user.displayName} fue eliminado de tu lista de amigos`,
        duration: 2000
      }).then((toast) => toast.present());
    })

  selectFriend = (event: CustomEvent<IonCheckbox>) => {
    const friend: LotteryUser = event.detail.value as unknown as LotteryUser;
    if (event.detail.checked) {
      this.selectedFriends.push(friend);
    } else {
      this.selectedFriends = this.selectedFriends.filter((selectedFriend: LotteryUser) => friend.uid !== selectedFriend.uid);
    }
  }

  showProfilePage = (friend: LotteryUser) => this.navController
    .navigateForward(['../profile', friend.uid], { relativeTo: this.activatedRoute })

}
