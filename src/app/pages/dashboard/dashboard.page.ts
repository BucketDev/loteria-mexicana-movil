import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
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
              private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.loading = true;
    this.boardsSub = this.boardsService.findAllByUserUid().subscribe((boards: Board[]) => {
      this.loading = false;
      this.boards = boards;
    });
    this.notificationsSub = this.notificationsService.getUnreadNumber().subscribe((notifications) => {
      this.notificationsUnread = notifications;
    });
  }

  ngOnDestroy() {
    this.boardsSub.unsubscribe();
    this.notificationsSub.unsubscribe();
  }

  showModalBoard = async () => {
    const modal = await this.modalController.create({
      component: NewBoardPage
    });
    await modal.present();
  }

  showBoard = (uid: string) => this.router.navigateByUrl(`/board/${this.fireAuth.lotteryUser.uid}/${uid}`);

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

}
