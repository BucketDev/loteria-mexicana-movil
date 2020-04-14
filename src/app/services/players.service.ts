import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {FireAuthService} from './security/fire-auth.service';
import {map} from 'rxjs/operators';
import {LotteryUser} from '../models/lottery-user.class';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private collectionName = '/players';
  private collectionUsersName = '/users';
  private collectionBoardsName = '/boards';

  constructor(private db: AngularFirestore,
              private auth: FireAuthService) { }

  getPlayers = (userUid: string, boardUid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(boardUid)
    .collection(this.collectionName).get().pipe(map((snapshot: QuerySnapshot<DocumentData>) => {
      const players = snapshot.docs.map((document: QueryDocumentSnapshot<LotteryUser>) => {
        const player: LotteryUser = document.data();
        return {uid: document.id, ...player};
      });
      players.push(this.auth.lotteryUser);
      return players;
    }))
}
