import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardsService} from '../../services/boards.service';
import {ActivatedRoute} from '@angular/router';
import {
  ActionSheetController,
  AlertController, IonContent,
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
import {HistorySlidesComponent} from "../../components/history-slides/history-slides.component";
import {BoardComponent} from "../../components/board/board.component";
import {Board} from "../../models/board.class";
import {Card} from "../../models/card.class";
import {Winner} from "../../models/winner.class";
import {takeWhile} from "rxjs/operators";
import {BoardStatus} from "../../models/board-status.enum";
import {Message} from "../../models/message.class";
import {MessagesService} from "../../services/messages.service";
import {firestore} from 'firebase/app';

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
  messagesSub: Subscription;
  isCreator: boolean;
  boardUid: string;
  userUid: string;
  loading = true;
  lastMessageDate: firestore.Timestamp;
  @ViewChild(IonContent, { static: false }) boardContent: IonContent;
  maxWidth: number;
  maxHeight: number;

  constructor(public boardsService: BoardsService,
              private winnersService: WinnersService,
              private messagesService: MessagesService,
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

  initBoard = async (loading: HTMLIonLoadingElement) => {
    await loading.present();
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
    this.updatingBoardSub && this.updatingBoardSub.unsubscribe();
    this.winnersSub && this.winnersSub.unsubscribe();
  }

  ionViewDidEnter() {
    this.lastMessageDate = firestore.Timestamp.fromDate(new Date());
    this.listenForMessages();
    this.boardContent.getScrollElement()
      .then((element) => {
        const remainingHeight = element.clientHeight - 112;
        this.maxWidth = remainingHeight / 1.5;
        this.maxHeight = element.clientHeight - 136;
      })
  }

  ionViewWillLeave() {
    this.messagesSub.unsubscribe();
  }

  showActionSheet = async () => {
    const buttons = [{
      text: 'Cerrar',
      role: 'cancel',
      icon: 'close-circle'
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
    let initBoard = { status: BoardStatus.STARTED, currentDeck: this.cardsService.generateCurrentDeck() };
    await this.boardsService.update(this.boardUid, initBoard);
  }

  pauseGame = async () => {
    await this.boardsService.update(this.boardUid, { status: BoardStatus.PAUSED });
  }

  clear = () => {
    this.historySlides.clear();
    this.boardComponent.clear();
  }

  listenForWinners = () =>this.winnersSub = this.winnersService.getWinnersByUserAndBoard(this.userUid, this.boardUid)
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

  listenForBoard = () => this.updatingBoardSub = this.boardsService.listenForUpdates(this.userUid, this.boardUid)
      .subscribe(async (board: Board) => {
        // Status changed
        if (this.boardsService.board.status !== board.status) {
          if (board.status === BoardStatus.STARTED) {
            this.clear();
            this.dealCards();
          } else if (board.status === BoardStatus.FINALIZED) {

          }
        }
        this.boardsService.board = board;
      });

  listenForMessages = () => this.messagesSub =
    this.messagesService.findLastMessage(this.userUid, this.boardUid, this.lastMessageDate)
    .subscribe(async (message: Message) => {
      if (message) {
        this.lastMessageDate = message.creationDate as firestore.Timestamp;
        const toast = await this.toastController.getTop();
        if (toast) {
          await this.toastController.dismiss();
        }
        this.toastController.create({
          message: `<strong>${message.displayName}:</strong> ${message.text}`,
          duration: 3000,
          buttons: [{
            text: 'Ver',
            handler: this.showMessagesPage
          }, {
            text: 'Cerrar',
            role: 'cancel'
          }]
        }).then(toast => toast.present());
      }
  });

  dealCards = () => {
    this.boardsService.currentCard = -1;
    interval(1000)
      .pipe(takeWhile(() => this.boardsService.board.status === BoardStatus.STARTED))
      .subscribe(async (sec) => {
        if (sec > 0 && sec % this.boardsService.board.timeLapse === 0) {
          this.boardsService.currentCard++;
          if (this.boardsService.currentCard < this.boardsService.board.currentDeck.length) {
            this.historySlides.addCards();
          } else {
            if (this.isCreator) {
              await this.boardsService.update(this.boardUid, { status: BoardStatus.FINALIZED });
            }
          }
        }
      });
  }

  cardSelected = (card: Card) => {
    if (this.historySlides.isCardSelectable(card)) {
      this.boardComponent.selectCard(card);
    }
  }

  generateCurrentBoard = () => this.boardComponent.generateCurrentBoard();

  canPlay = () => this.boardsService.board.status !== BoardStatus.STARTED;

  showMessagesPage = () => this.navController.navigateForward(['messages'],
    { relativeTo: this.activatedRoute, state: { userUid: this.userUid, boardUid: this.boardUid } })

  showFriendsPage = () => this.navController.navigateForward(['players'],
    { relativeTo: this.activatedRoute, state: { userUid: this.userUid, boardUid: this.boardUid } })

}
