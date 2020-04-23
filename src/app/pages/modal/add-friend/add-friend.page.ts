import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController} from "@ionic/angular";
import {LotteryUser} from "../../../models/lottery-user.class";
import {MyFriendsComponent} from "../../../components/friends/my-friends/my-friends.component";
import {BoardsService} from "../../../services/boards.service";

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  @Input() players: LotteryUser[];
  @Input() boardUid: string;
  @ViewChild(MyFriendsComponent, {static: true}) friendsComponent: MyFriendsComponent;

  constructor(public modalController: ModalController,
              private boardsService: BoardsService,
              private loadingController: LoadingController) { }

  ngOnInit() { }

  addPlayers = () => {
    this.loadingController.create({
      message: 'Invitando jugadores...'
    }).then(async loading => {
      await loading.present();
      this.boardsService.addPlayers(this.boardUid, this.friendsComponent.selectedFriends)
        .then(() => {
          loading.dismiss();
          this.modalController.dismiss();
        });
    })
  }

}
