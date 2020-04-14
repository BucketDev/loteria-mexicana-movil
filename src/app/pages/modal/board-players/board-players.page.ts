import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PlayersService} from '../../../services/players.service';
import {Observable} from 'rxjs';
import {LotteryUser} from '../../../models/lottery-user.class';
import {BoardsService} from '../../../services/boards.service';

@Component({
  selector: 'app-board-players',
  templateUrl: './board-players.page.html',
  styleUrls: ['./board-players.page.scss'],
})
export class BoardPlayersPage implements OnInit{

  @Input() userUid: string;
  players: LotteryUser[];
  loading = true;

  constructor(public modalController: ModalController,
              private playersService: PlayersService,
              private boardsService: BoardsService) {
  }

  ngOnInit(): void {
    this.playersService.getPlayers(this.userUid, this.boardsService.board.uid).subscribe(players => {
      this.loading = false;
      this.players = players;
    });
  }

}
