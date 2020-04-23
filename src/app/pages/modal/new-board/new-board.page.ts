import {Component, OnInit, ViewChild} from '@angular/core';
import {IonCheckbox, ModalController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LotteryUser} from '../../../models/lottery-user.class';
import {Observable} from 'rxjs';
import {FriendsService} from '../../../services/friends.service';
import {FireAuthService} from '../../../services/security/fire-auth.service';
import {BoardsService} from '../../../services/boards.service';
import {DocumentReference} from '@angular/fire/firestore';
import {Board} from '../../../models/board.class';
import {Router} from '@angular/router';
import {MyFriendsComponent} from '../../../components/friends/my-friends/my-friends.component';

@Component({
  selector: 'app-modal-board',
  templateUrl: './new-board.page.html',
  styleUrls: ['./new-board.page.scss'],
})
export class NewBoardPage implements OnInit {

  formBoard: FormGroup;
  @ViewChild(MyFriendsComponent, {static: true}) friendsComponent: MyFriendsComponent;

  constructor(private modalController: ModalController,
              private toastController: ToastController,
              private friendsService: FriendsService,
              private boardsService: BoardsService,
              private router: Router,
              private auth: FireAuthService) {
    this.formBoard = new FormGroup({
      title: new FormControl('', [
          Validators.required
      ])
    });
  }

  ngOnInit() { }

  hideModalBoard = async () => await this.modalController.dismiss();

  saveBoard = () => {
    const board: Board = this.formBoard.value;
    this.boardsService.postBoard(board)
      .then((document: DocumentReference) => {
        const players = [...this.friendsComponent.selectedFriends, this.auth.lotteryUser];
        this.boardsService.addPlayers(document.id, players).then(() => {
          this.toastController.create({
            message: `El tablero <strong>${board.title}</strong> ha sido creado exitosamente`,
            duration: 3000
          }).then(toast => toast.present());
          this.modalController.dismiss()
            .then(() => this.router.navigateByUrl(`/board/${this.auth.lotteryUser.uid}/${document.id}`));
        });
      })
      .catch(async (err) => {
        console.error(err);
        await this.modalController.dismiss();
      });
  }

}
