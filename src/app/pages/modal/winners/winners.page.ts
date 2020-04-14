import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {BoardsService} from '../../../services/boards.service';
import {Observable} from 'rxjs';
import {Winner} from '../../../models/winner.class';
import {WinnersService} from '../../../services/winners.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.page.html',
  styleUrls: ['./winners.page.scss'],
})
export class WinnersPage implements OnInit {

  @Input() userUid: string;
  winners: Winner[];
  loading = true;

  constructor(public modalController: ModalController,
              private boardsService: BoardsService,
              private winnersService: WinnersService) { }

  ngOnInit() {
    this.winnersService.findByUserUidAndUid(this.userUid, this.boardsService.board.uid)
      .subscribe((winners: Winner[]) => {
        this.loading = false;
        this.winners = winners;
      }
    );
  }

  getPositionImage = (position: number) => {
    switch (position) {
      case 1:
        return 'https://img.icons8.com/color/40/medal2--v1.png';
      case 2:
        return 'https://img.icons8.com/color/40/medal-second-place--v1.png';
      case 3:
        return 'https://img.icons8.com/color/40/medal2-third-place--v1.png';
      default:
        return `https://img.icons8.com/color/40/${position}.png`;
    }
  }

}
