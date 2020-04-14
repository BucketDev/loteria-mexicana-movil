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
import {FriendsComponent} from '../../../components/friends/friends.component';

@Component({
  selector: 'app-modal-board',
  templateUrl: './new-board.page.html',
  styleUrls: ['./new-board.page.scss'],
})
export class NewBoardPage implements OnInit {

  formBoard: FormGroup;
  @ViewChild(FriendsComponent, {static: true}) friendsComponent: FriendsComponent;

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
      .then(async (document: DocumentReference) => {
        const toast = await this.toastController.create({
          message: `El tablero <strong>${board.title}</strong> ha sido creado exitosamente`,
          duration: 3000
        });
        await this.modalController.dismiss();
        await toast.present();
        await this.router.navigateByUrl(`/board/${this.auth.lotteryUser.uid}/${document.id}`);
        this.boardsService.addPlayers(document.id, this.friendsComponent.selectedFriends);
      })
      .catch(async (err) => {
        console.log(err);
        await this.modalController.dismiss();
      });
  }

}
