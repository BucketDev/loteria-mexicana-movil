import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {LotteryUser} from '../../../models/lottery-user.class';
import {FriendsService} from '../../../services/friends.service';
import {IonCheckbox, NavController, ToastController} from '@ionic/angular';
import {DocumentSnapshot} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss'],
})
export class MyFriendsComponent implements OnInit {

  loading = true;
  user: LotteryUser;
  selectedFriends: LotteryUser[] = [];
  @Input() players: LotteryUser[];
  @Input() deletableFriend = false;
  @Input() selectableFriend = true;
  @ViewChildren(IonCheckbox) friendsCheckBox: QueryList<IonCheckbox>;

  constructor(private friendsService: FriendsService,
              private toastController: ToastController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute) {
    friendsService.find().subscribe((user: LotteryUser) => {
      this.user = user;
      this.user.friends = [];
      this.validateExtras();
      user.friendsRef.forEach(async friendRef => {
        const friendSnap: DocumentSnapshot<LotteryUser> = await friendRef.get() as DocumentSnapshot<LotteryUser>;
        const friend = friendSnap.data();
        this.user.friends.push({...friend, uid: friendSnap.id });
      })
      this.loading = false;
    });
  }

  validateExtras = () => {
    // if players are sent, then remove from the list of friends to avoid selecting it
    if (this.players) {
      this.user.friendsRef = this.user.friendsRef.filter(friendRef =>
        !this.players.find(player => player.uid === friendRef.id));
    }
  }

  ngOnInit() { }

  get emptyTitle() {
    return this.players && this.players.length > 0 ? 'No tienes más amigos' : 'No tienes amigos aún';
  }

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
