import { Injectable } from '@angular/core';
import {Board} from '../models/board.class';
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {FireAuthService} from './security/fire-auth.service';
import {Winner} from '../models/winner.class';
import {map} from 'rxjs/operators';
import {firestore} from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class WinnersService {

  private collectionUsersName = '/users';
  private collectionBoardsName = '/boards';
  private collectionName = '/winners';
  public board: Board;

  constructor(private db: AngularFirestore,
              private auth: FireAuthService) { }

  addWinningPlayer = (userUid: string, uid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(uid).collection(this.collectionName).doc(this.auth.lotteryUser.uid)
    .set({...new Winner(this.auth.lotteryUser)})

  empty = (boardUid: string) => this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
    .collection(this.collectionBoardsName).doc(boardUid).collection(this.collectionName).get()
    .subscribe((snapshot: QuerySnapshot<Winner>) => {
      const batch = this.db.firestore.batch();
      snapshot.docs.forEach((document: QueryDocumentSnapshot<Winner>) => {
        batch.delete(document.ref);
      });
      return batch.commit()
    })

  findByUserUidAndUid = (userUid: string, uid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(uid)
    .collection(this.collectionName, ref => ref.orderBy('creationDate', 'asc'))
    .valueChanges().pipe(map((documents) =>
      documents.map((document: DocumentData) => ({...document, creationDate: document.creationDate.toDate()}))
    ))

  getWinnersByUserAndBoard = (userUid: string, uid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(uid)
    .collection(this.collectionName, ref => ref.where('creationDate', '>=', firestore.Timestamp.now())
      .orderBy('creationDate', 'asc'))
    .snapshotChanges().pipe(map((actions) => {
      let winner: Winner;
      actions.forEach((action: DocumentChangeAction<Winner>) => {
        if (action.payload.type === 'added') {
          const player: Winner = action.payload.doc.data();
          winner =  {...player, creationDate: (player.creationDate as firestore.Timestamp).toDate()};
        } else {
          winner = null;
        }
      });
      return winner;
    }))
}
