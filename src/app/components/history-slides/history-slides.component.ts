import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {Card} from '../../models/card.class';
import {CardsService} from '../../services/cards.service';
import {BoardsService} from '../../services/boards.service';
import {BoardStatus} from "../../models/board-status.enum";

@Component({
  selector: 'app-history-slides',
  templateUrl: './history-slides.component.html',
  styleUrls: ['./history-slides.component.scss'],
})
export class HistorySlidesComponent implements OnInit {

  historyCards: Card[] = [];

  constructor(private boardsService: BoardsService,
              private cardsService: CardsService) {
  }

  ngOnInit() {
    if (this.boardsService.board.status === BoardStatus.NEW) {
      this.clear();
    }
  }

  getBoardStatus = () => {
    switch (this.boardsService.board.status) {
      case BoardStatus.NEW:
      case BoardStatus.FINALIZED:
        return 'Juego por comenzar';
      case BoardStatus.STARTED:
        return 'Juego iniciado, por favor espere'
      case BoardStatus.PAUSED:
      default:
        return null;
    }
  }

  addCards = () => {
    for (let idx = this.historyCards.length; idx <= this.boardsService.currentCard; idx++) {
      const indexDeck = this.boardsService.board.currentDeck[idx];
      this.historyCards.push(this.cardsService.cards[indexDeck]);
    }
    new Audio(this.historyCards[this.historyCards.length - 1].soundURL).play();
  }

  clear = () => this.historyCards = [];

  isCardSelectable = (card: Card) => !!this.historyCards
    .find((historyCard: Card) => historyCard.index === card.index)

}
