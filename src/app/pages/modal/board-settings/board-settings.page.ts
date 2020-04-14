import {Component, OnInit, ViewChild} from '@angular/core';
import {IonRadioGroup, ModalController} from '@ionic/angular';
import {BoardsService} from '../../../services/boards.service';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.page.html',
  styleUrls: ['./board-settings.page.scss'],
})
export class BoardSettingsPage implements OnInit {

  @ViewChild(IonRadioGroup, {static: true}) radioGroup: IonRadioGroup;

  constructor(public modalController: ModalController,
              public boardsService: BoardsService) { }

  ngOnInit() {
    this.radioGroup.value = this.boardsService.board.winStrategy;
  }

  updateTimeLapse = (event: CustomEvent) => this.boardsService.board.timeLapse = event.detail.value;

  strategySelected = (event) => this.boardsService.board.winStrategy = event.detail.value;

  updateBoard = () => {
    const {winStrategy, timeLapse} = this.boardsService.board;
    this.boardsService.update(this.boardsService.board.uid, { winStrategy, timeLapse })
      .then(() => {
        this.modalController.dismiss();
      });
  }

}
