import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  PopoverController,
  ToastController
} from "@ionic/angular";
import {NotificationPopoverComponent} from "../../components/notification-popover/notification-popover.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Board} from "../../models/board.class";
import {NewBoardPage} from "../modal/new-board/new-board.page";
import {BoardsService} from "../../services/boards.service";
import {FireAuthService} from "../../services/security/fire-auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {

  boards: Board[];
  boardsSub: Subscription;
  loading = true;

  constructor(public boardsService: BoardsService,
              private popoverController: PopoverController,
              private modalController: ModalController,
              private router: Router,
              private auth: FireAuthService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private toastController: ToastController) { }

  showNotifications = (event: MouseEvent) => {
    this.popoverController.create({
      component: NotificationPopoverComponent,
      event
    }).then(popover => popover.present());
  }

  ngOnInit(): void {
    this.loading = true;
    this.boardsSub = this.boardsService.findAllByUserUid().subscribe((boards: Board[]) => {
      this.loading = false;
      this.boards = boards;
    });
  }

  ngOnDestroy() {
    this.boardsSub.unsubscribe();
  }

  showModalBoard = async () => {
    const modal = await this.modalController.create({
      component: NewBoardPage
    });
    await modal.present();
  }

  showBoard = (uid: string) => this.router.navigateByUrl(`/board/${this.auth.lotteryUser.uid}/${uid}`);

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

}
