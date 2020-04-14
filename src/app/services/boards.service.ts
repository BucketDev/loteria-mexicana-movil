import { Injectable } from '@angular/core';
import {
  AngularFirestore, AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentReference, DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Board} from '../models/board.class';
import {LotteryUser} from '../models/lottery-user.class';
import {FireAuthService} from './security/fire-auth.service';
import {CardsService} from './cards.service';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  private collectionUsersName = '/users';
  private collectionName = '/boards';
  private collectionPlayersName = '/players';
  private collectionWinnersName = '/winners';
  public board: Board;

  constructor(private db: AngularFirestore,
              private auth: FireAuthService,
              private cardsService: CardsService) { }

  postBoard = (board: Board) => this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
    .collection(this.collectionName).add({...new Board(board.title), creationDate: new Date()})

  addPlayers = (uid: string, friends: LotteryUser[]) => {
    const playersCollection = this.db.collection(this.collectionUsersName)
      .doc(this.auth.lotteryUser.uid).collection(this.collectionName).doc(uid)
      .collection(this.collectionPlayersName);
    friends.forEach((friend: LotteryUser) => playersCollection.doc(friend.uid).set({...friend}));
  }

  findByUid = (userUid: string, boardUid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionName).doc(boardUid).get()
    .pipe(map((document: DocumentSnapshot<Board>) => ({...document.data(), uid: document.id})))

  findAllByUserUid = () => this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
    .collection(this.collectionName, ref => ref.orderBy('creationDate', 'asc'))
    .snapshotChanges()
    .pipe(map((documents: DocumentChangeAction<Board>[]) => documents.map((action: DocumentChangeAction<Board>) => {
        const board: Board = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        board.creationDate = (board.creationDate as unknown as Timestamp).toDate();
        return { uid, ...board};
    })
  ))

  listenForUpdates = (userUid: string, uid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionName).doc(uid).valueChanges().pipe(map((document) => ({ ...document, uid })))

  update = (uid: string, updateObject: any) => this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
    .collection(this.collectionName).doc(uid).update(updateObject)

  increaseCurrentCard = (uid: string) => this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
    .collection(this.collectionName).doc(uid).update({ currentCard: this.board.currentCard + 1 })

  delete = async (boardUid: string) => {
    const batch = this.db.firestore.batch();
    const boardDocument: AngularFirestoreDocument = this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
      .collection(this.collectionName).doc(boardUid);

    const players: DocumentReference[] = await boardDocument.collection(this.collectionPlayersName).get()
      .pipe(map((snapshot: QuerySnapshot<LotteryUser>) =>
        snapshot.docs.map((document: QueryDocumentSnapshot<LotteryUser>) => document.ref))).toPromise();
    players.forEach(player => batch.delete(player));

    const winners: DocumentReference[] = await boardDocument.collection(this.collectionWinnersName).get()
      .pipe(map((snapshot: QuerySnapshot<LotteryUser>) =>
        snapshot.docs.map((document: QueryDocumentSnapshot<LotteryUser>) => document.ref))).toPromise();
    winners.forEach(winner => batch.delete(winner));

    batch.delete(boardDocument.ref);
    await batch.commit();
  }
}
