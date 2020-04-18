import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot} from "@angular/fire/firestore";
import {map} from "rxjs/operators";
import {Message} from "../models/message.class";
import {FireAuthService} from "./security/fire-auth.service";
import {firestore} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  collectionName = '/messages';
  collectionUsersName = '/users';
  collectionBoardsName = '/boards';

  constructor(private db: AngularFirestore,
              private fireAuth: FireAuthService) { }

  getLastMessagesByBoard = (userUid: string, boardUid: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(boardUid)
    .collection(this.collectionName, ref => ref.orderBy('creationDate', 'desc').limit(10))
    .snapshotChanges().pipe(map((actions) =>
      actions.map((action) => action.payload.doc).reverse()
    ));

  findLastMessage = (userUid: string, boardUid: string, lastUpdate: firestore.Timestamp) =>
    this.db.collection(this.collectionUsersName).doc(userUid)
      .collection(this.collectionBoardsName).doc(boardUid)
      .collection(this.collectionName, ref =>
        ref.where('creationDate', '>', lastUpdate).limit(1)
          .orderBy('creationDate', 'desc'))
    .valueChanges().pipe(map((messages: DocumentData[]) => messages.pop()))

  getNext = (userUid: string, boardUid: string, messageDoc: QueryDocumentSnapshot<Message>) =>
    this.db.collection(this.collectionUsersName).doc(userUid).collection(this.collectionBoardsName).doc(boardUid)
    .collection(this.collectionName, ref => ref.orderBy('creationDate', 'desc').limit(10)
      .startAfter(messageDoc)).get().pipe(map((document) => document.docs.reverse()));

  addMessage = (userUid: string, boardUid: string, text: string) => this.db.collection(this.collectionUsersName).doc(userUid)
    .collection(this.collectionBoardsName).doc(boardUid).collection(this.collectionName)
    .add({
      text, creationDate: new Date(),
      displayName: this.fireAuth.lotteryUser.displayName,
      userUid: this.fireAuth.lotteryUser.uid
    })

}
