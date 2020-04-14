import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardsService} from '../../services/cards.service';
import {Card} from '../../models/card.class';
import {BoardsService} from '../../services/boards.service';
import {WinnersService} from '../../services/winners.service';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {

  @Input() boardUid: string;
  @Input() userUid: string;
  currentBoard: Card[];
  @Output() cardSelectedEvent = new EventEmitter<Card>();
  isWinnerBoard = false;

  constructor(private storage: StorageService,
              private cardsService: CardsService,
              private boardsService: BoardsService,
              private winnersService: WinnersService) { }

  ngOnInit() {
    this.storage.get(this.boardUid).then((value) => {
      if (value == null) {
        this.currentBoard = this.cardsService.generateCurrentBoard();
        this.storage.set(this.boardUid, this.currentBoard);
      } else {
        this.currentBoard = value;
      }
    });
  }

  generateCurrentBoard = () => {
    this.currentBoard.forEach((card: Card) => card.selected = false);
    this.currentBoard = this.cardsService.generateCurrentBoard();
    this.storage.set(this.boardUid, this.currentBoard);
  }

  cardSelected = (card: Card) => !card.selected && this.cardSelectedEvent.emit(card);

  selectCard = (card: Card) => {
    this.currentBoard.find((boardCard: Card) => boardCard.index === card.index).selected = true;
    this.storage.set(this.boardUid, this.currentBoard);
    if (!this.isWinnerBoard && this.winningBoard()) {
      this.winnersService.addWinningPlayer(this.userUid, this.boardUid);
      this.isWinnerBoard = true;
    }
  }

  clear = () => {
    console.log("Board Component Clear", this.currentBoard.filter(card => card.selected));
    this.cardsService.clearCards();
    console.log("Board Component Clear", this.currentBoard.filter(card => card.selected));
    this.isWinnerBoard = false;
  }

  winningBoard = (): boolean => {
    switch (this.boardsService.board.winStrategy) {
      case 0:
        return this.currentBoard.every((card: Card) => card.selected);
      case 1:
        let columnComplete = false;
        for (let columns = 0; columns < 4; columns++) {
          columnComplete = true;
          for (let rows = 0; rows < 4; rows++) {
            if (!this.currentBoard[(4 * rows) + columns].selected) {
              columnComplete = false;
              break;
            }
          }
          if (columnComplete) { break; }
        }
        console.log('Won?', columnComplete);
        return columnComplete;
      case 2:
        let rowsComplete = false;
        for (let rows = 0; rows < 4; rows++) {
          rowsComplete = true;
          for (let columns = 0; columns < 4; columns++) {
            if (!this.currentBoard[(4 * rows) + columns].selected) {
              rowsComplete = false;
              break;
            }
          }
          if (rowsComplete) { break; }
        }
        console.log('Won?', rowsComplete);
        return rowsComplete;
    }
  }

}
