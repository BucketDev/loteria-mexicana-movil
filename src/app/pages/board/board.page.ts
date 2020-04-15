import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardsService} from '../../services/boards.service';
import {ActivatedRoute} from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  PopoverController,
  ToastController
} from '@ionic/angular';
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
import {takeWhile} from "rxjs/operators";
import {BoardStatus} from "../../models/board-status.enum";

@Component({
  selector: 'app-board-page',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, OnDestroy {

  @ViewChild(HistorySlidesComponent, {static: false}) historySlides: HistorySlidesComponent;
  @ViewChild(BoardComponent, {static: false}) boardComponent: BoardComponent;
  updatingBoardSub: Subscription;
  winnersSub: Subscription;
  isCreator: boolean;
  boardUid: string;
  userUid: string;
  loading = true;

  constructor(public boardsService: BoardsService,
              private winnersService: WinnersService,
              private cardsService: CardsService,
              private activatedRoute: ActivatedRoute,
              private auth: FireAuthService,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private toastController: ToastController,
              private loadingController: LoadingController,
              private popoverController: PopoverController,
              private alertController: AlertController,
              private navController: NavController) {
    const {userUid, uid} = this.activatedRoute.snapshot.params;
    this.boardUid = uid;
    this.userUid = userUid;
    this.isCreator = userUid === this.auth.lotteryUser.uid;
    this.loadingController.create({
      message: 'Cargando tablero...',
    }).then(this.initBoard);
  }

  ngOnInit() {
  }

  initBoard = (loading: HTMLIonLoadingElement) => {
    loading.present();
    this.boardsService.findByUid(this.userUid, this.boardUid).toPromise().then(board => {
      if (Object.keys(board).length > 1) {
        this.boardsService.board = board;
        this.loading = false;
        this.listenForBoard();
        this.listenForWinners();
      } else {
        this.alertController.create({
          header: 'Lo sentimos :(',
          message: 'El tablero que intentas visitar ya no existe',
          buttons: [{
            role: 'cancel',
            text: 'Aceptar',
            handler: () => {
              this.navController.navigateRoot(['/dashboard'], { relativeTo: this.activatedRoute });
            }
          }]
        }).then(alert => alert.present());
      }
      loading.dismiss();
    });
  }

  ngOnDestroy(): void {
    if (this.updatingBoardSub) {
      this.updatingBoardSub.unsubscribe();
      this.winnersSub.unsubscribe();
    }
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
    let initBoard = { status: BoardStatus.STARTED };
    if (this.boardsService.board.status === BoardStatus.NEW || this.boardsService.board.status === BoardStatus.FINALIZED) {
      initBoard['currentDeck'] = this.cardsService.generateCurrentDeck();
    }
    this.boardsService.update(this.boardUid, initBoard).then(() => {
      interval(1000)
        .pipe(takeWhile(() => this.boardsService.board.status === BoardStatus.STARTED))
        .subscribe((sec) => {
          if (sec > 0 && sec % this.boardsService.board.timeLapse === 0) {
          this.boardsService.increaseCurrentCard(this.boardUid)
            .then(async () => {
              if (this.boardsService.board.currentCard >= 53) {
                await this.boardsService.update(this.boardUid, { status: BoardStatus.FINALIZED, currentCard: -1 });
              }
            })
            .catch(console.error)
        }
      });
    });
  }

  pauseGame = async () => {
    await this.boardsService.update(this.boardUid, { status: BoardStatus.PAUSED });
  }

  clear = () => {
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
          if ((this.boardsService.board.status === BoardStatus.NEW ||
            this.boardsService.board.status === BoardStatus.FINALIZED) && board.status === BoardStatus.STARTED) {
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

  canPlay = () => this.boardsService.board.status !== BoardStatus.STARTED;

  canPause = () => this.boardsService.board.status === BoardStatus.STARTED;

}
