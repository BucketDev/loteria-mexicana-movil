import {Component} from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Board} from "../../models/board.class";
import {NewBoardPage} from "../modal/new-board/new-board.page";
import {BoardsService} from "../../services/boards.service";
import {FireAuthService} from "../../services/security/fire-auth.service";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../services/notifications.service";
import {Plugins} from '@capacitor/core';
import {environment} from "../../../environments/environment";
import {AdOptions, AdPosition, AdSize} from 'capacitor-admob';

const {AdMob} = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {

  boards: Board[];
  boardsSub: Subscription;
  notificationsSub: Subscription;
  notificationsUnread: number;
  loading = true;
  options: AdOptions = {
    adId: environment.adBannerId,
    adSize: AdSize.BANNER,
    position: AdPosition.BOTTOM_CENTER
  }

  constructor(public boardsService: BoardsService,
              private popoverController: PopoverController,
              private modalController: ModalController,
              private router: Router,
              public fireAuth: FireAuthService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private notificationsService: NotificationsService,
              private platform: Platform) {
  }

  ionViewWillEnter() {
    this.loading = true;
    this.boardsSub = this.boardsService.findAllByUserUid().subscribe((boards: Board[]) => {
      this.loading = false;
      this.boards = boards;
    });
    this.notificationsSub = this.notificationsService.getUnreadNumber().subscribe((notifications) => {
      this.notificationsUnread = notifications;
    });
  }

  ionViewDidEnter() {
    if (this.platform.is('capacitor')) {
      AdMob.showBanner(this.options).then(
        value => console.log(value),
        error => console.error(error)
      );
    }
  }

  ionViewDidLeave() {
    if (this.platform.is('capacitor')) {
      AdMob.removeBanner().then(
        value => console.log(value),
        error => console.error(error)
      );
    }
    this.boardsSub.unsubscribe();
    this.notificationsSub.unsubscribe();
  }

  showModalBoard = async () => {
    const modal = await this.modalController.create({
      component: NewBoardPage
    });
    await modal.present();
  }

  showBoard = (uid: string) => this.navController.navigateForward([`/board/`, this.fireAuth.lotteryUser.uid, uid],
    { relativeTo: this.activatedRoute });

  showDeleteBoard = (board: Board) => this.alertController.create({
    header: '¿Deseas borrar el tablero?',
    message: `Al dar clic en <strong>Aceptar</strong> confirmas que deseas borrar el tablero <strong>${board.title}</strong>`,
    buttons: [{
      role: 'cancel',
      text: 'Cancelar'
    }, {
      text: 'Aceptar',
      handler: () => {
        this.loadingController.create({
          message: 'Borrando tablero...'
        }).then(loading => {
          loading.present();
          this.boardsService.delete(board.uid).then(() => {
            this.toastController.create({
              duration: 3000,
              message: `El tablero <strong>${board.title}</strong> ha sido borrado exitosamente`
            }).then(toast => {
              loading.dismiss();
              toast.present();
            })
          });
        });
      }
    }]
  }).then(alert => alert.present());

  showProfilePage = () => this.navController
    .navigateForward(['../profile', this.fireAuth.lotteryUser.uid], { relativeTo: this.activatedRoute })

  showFriendsPage = () => this.navController
    .navigateForward(['../friends'], { relativeTo: this.activatedRoute });

  showNotificationsPage = () => this.navController
    .navigateForward(['../notifications'], { relativeTo: this.activatedRoute });

  showAd = () => {
    if (this.platform.is('capacitor')) {
      AdMob.showInterstitial().then(
        value => {
          console.log(value); // true
        },
        error => {
          console.error(error); // show error
        }
      );
    }
  }

}
