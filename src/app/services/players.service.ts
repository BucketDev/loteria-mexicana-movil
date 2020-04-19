import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {FireAuthService} from './security/fire-auth.service';
import {map} from 'rxjs/operators';
import {LotteryUser} from '../models/lottery-user.class';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private collectionName = '/players';
  private collectionUsersName = '/users';
  private collectionBoardsName = '/boards';

  constructor(private db: AngularFirestore,
              private auth: FireAuthService) { }

  getPlayers = (userUid: string, boardUid: string): Observable<LotteryUser[]> =>
    this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(boardUid)
    .collection(this.collectionName).valueChanges().pipe(map((documents: DocumentData[]) =>
      documents.map((document: DocumentData) => document as LotteryUser)
    ))
}
