import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardsService} from '../../services/boards.service';
import {ActivatedRoute} from '@angular/router';
import {ActionSheetController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {FireAuthService} from '../../services/security/fire-auth.service';
import {interval, Subscription} from 'rxjs';
import {CardsService} from '../../services/cards.service';
import {BoardSettingsPage} from '../modal/board-settings/board-settings.page';
import {WinnersService} from '../../services/winners.service';
import {WinnersPage} from '../modal/winners/winners.page';
import {BoardPlayersPage} from '../modal/board-players/board-players.page';
import {HistorySlidesComponent} from "../../components/history-slides/history-slides.component";
import {BoardComponent} from "../../components/board/board.component";
import {Board} from "../../models/board.class";
import {Card} from "../../models/card.class";
import {Winner} from "../../models/winner.class";

@Component({
  selector: 'app-board-page',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, OnDestroy {

  @ViewChild(HistorySlidesComponent, {static: false}) historySlides: HistorySlidesComponent;
  @ViewChild(BoardComponent, {static: false}) boardComponent: BoardComponent;
  isCreator: boolean;
  playingBoardSub: Subscription;
  updatingBoardSub: Subscription;
  winnersSub: Subscription;
  boardUid: string;
  userUid: string;
  resume = false;
  loading = true;

  constructor(public boardsService: BoardsService,
              private winnersService: WinnersService,
              private cardsService: CardsService,
              private activatedRoute: ActivatedRoute,
              private auth: FireAuthService,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private toastController: ToastController,
              private loadingController: LoadingController) { }

  ngOnInit() {
    const {userUid, uid} = this.activatedRoute.snapshot.params;
    this.boardUid = uid;
    this.userUid = userUid;
    this.isCreator = userUid === this.auth.lotteryUser.uid;
    this.loadingController.create({
      message: 'Cargando tablero...',
    }).then(loading => {
      loading.present();
      this.boardsService.findByUid(userUid, uid).toPromise()
        .then(board => {
          this.boardsService.board = board;
          this.listenForBoard();
          this.listenForWinners();
          this.loading = false;
          loading.dismiss();
        })
    });
  }

  ngOnDestroy(): void {
    this.updatingBoardSub.unsubscribe();
    this.winnersSub.unsubscribe();
  }

  showActionSheet = async () => {
    const buttons = [{
      text: 'Cerrar',
      role: 'cancel',
      icon: 'close-circle',
      handler: () => {
        console.log('Delete clicked');
      }
    }, {
      text: 'Ver jugadores',
      icon: 'people',
      handler: () => {
        this.modalController.create({
          component: BoardPlayersPage,
          componentProps: {
            userUid: this.userUid
          }
        }).then((modal) => modal.present());
      }
    }, {
      text: 'Lista de ganadores',
      icon: 'trophy',
      handler: async () => {
        const modal = await this.modalController.create({
          component: WinnersPage,
          componentProps: {
            userUid: this.userUid
          }
        });
        await modal.present();
      }
    }, {
      text: 'Generar nuevo tablero',
      icon: 'refresh-circle',
      handler: this.generateCurrentBoard
    }];
    if (this.isCreator) {
      buttons.unshift({
        text: 'Ajustes del tablero',
        icon: 'cog',
        handler: async () => {
          const modal = await this.modalController.create({
            component: BoardSettingsPage
          });
          await modal.present();
        }
      });
    }
    const actionSheet = await this.actionSheetController.create({ header: 'Menú del tablero', buttons });
    await actionSheet.present();
  }

  startGame = async () => {
    await this.winnersService.empty(this.boardUid);
    let initBoard = { status: 1 };
    if (!this.resume) {
      initBoard['currentDeck'] = this.cardsService.generateCurrentDeck();
    }
    this.boardsService.update(this.boardUid, initBoard).then(() => {
      const timer$ = interval(1000);
      this.playingBoardSub = timer$.subscribe((sec) => {
        if (sec > 0 && sec % this.boardsService.board.timeLapse === 0) {
          this.boardsService.increaseCurrentCard(this.boardUid)
            .then(async () => {
              if (this.boardsService.board.currentCard >= 53) {
                this.playingBoardSub.unsubscribe();
                this.resume = false;
                await this.boardsService.update(this.boardUid, { status: 0, currentCard: -1 });
              }
            })
            .catch(console.error)
        }
      });
    });
  }

  pauseGame = async () => {
    this.playingBoardSub.unsubscribe();
    this.winnersSub.unsubscribe();
    this.resume = true;
    await this.boardsService.update(this.boardUid, { status: 0 });
  }

  clear = () => {
    console.log("Board Page Clear");
    this.historySlides.clear();
    this.boardComponent.clear();
  }

  listenForWinners = () => {
    this.winnersSub = this.winnersService.getWinnersByUserAndBoard(this.userUid, this.boardUid)
      .subscribe((winner: Winner) => {
        if (winner) {
          new Audio('assets/sounds/winner-found.mp3').play();
          this.toastController.create({
            message: `Hay un nuevo ganador <strong>${winner.displayName}</strong>`,
            position: 'middle',
            duration: 3000,
            color: "success"
          }).then(toast => toast.present());
        }
      });
  }

  listenForBoard = () => {
    this.updatingBoardSub = this.boardsService.listenForUpdates(this.userUid, this.boardUid)
      .subscribe(async (board: Board) => {
        if (this.boardsService.board.status !== board.status) {
          // Status change
          if (board.status === 1) {
            console.log("status 1");
            this.clear();
          }
        }
        if (board.currentCard >= 0 && this.boardsService.board.currentCard !== board.currentCard) {
          // card change
          await this.historySlides.addCards(board.currentCard);
        }
        this.boardsService.board = board;
      });
  }

  cardSelected = (card: Card) => {
    if (this.historySlides.isCardSelectable(card)) {
      this.boardComponent.selectCard(card);
    }
  }

  generateCurrentBoard = () => this.boardComponent.generateCurrentBoard();

}
