import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PlayersService} from '../../../services/players.service';
import {Observable} from 'rxjs';
import {LotteryUser} from '../../../models/lottery-user.class';
import {BoardsService} from '../../../services/boards.service';
import {Router} from "@angular/router";
import {NewBoardPage} from "../../modal/new-board/new-board.page";
import {FriendsComponent} from "../../../components/friends/friends.component";
import {AddFriendPage} from "../../modal/add-friend/add-friend.page";
import {FireAuthService} from "../../../services/security/fire-auth.service";

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit{

  userUid: string;
  boardUid: string;
  players: LotteryUser[];
  loading = true;
  isCreator: boolean;

  constructor(public modalController: ModalController,
              private playersService: PlayersService,
              private boardsService: BoardsService,
              private router: Router,
              private fireAuth: FireAuthService) {
  }

  ngOnInit(): void {
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
      const {boardUid, userUid} = this.router.getCurrentNavigation().extras.state;
      this.userUid = userUid;
      this.boardUid = boardUid;
      this.isCreator = userUid === this.fireAuth.lotteryUser.uid;
      this.playersService.getPlayers(this.userUid, this.boardUid).subscribe((players: LotteryUser[]) => {
        this.loading = false;
        this.players = players;
      });
    }
  }

  showModalFriends = async () => {
    const modal = await this.modalController.create({
      component: AddFriendPage,
      componentProps: {
        boardUid: this.boardUid,
        players: this.players
      }
    });
    await modal.present();
  }

}
