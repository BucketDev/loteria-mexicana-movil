import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot
} from "@angular/fire/firestore";
import {FireAuthService} from "./security/fire-auth.service";
import {map} from "rxjs/operators";
import {Notification} from "../models/notification.class";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  collectionUsersName = '/users';
  collectionName = '/notifications';

  constructor(private db: AngularFirestore,
              private fireAuth: FireAuthService) { }

  getLast = () => this.db.collection(this.collectionUsersName).doc(this.fireAuth.lotteryUser.uid)
    .collection(this.collectionName, ref => ref.limit(10)
      .orderBy('creationDate', 'desc')).get()

  getNext = (notificationDoc: QueryDocumentSnapshot<Notification>) =>
    this.db.collection(this.collectionUsersName).doc(this.fireAuth.lotteryUser.uid)
    .collection(this.collectionName, ref => ref.limit(10).orderBy('creationDate', 'desc')
      .startAfter(notificationDoc)).get()

  getUnreadNumber = () => this.db.collection(this.collectionUsersName).doc(this.fireAuth.lotteryUser.uid)
    .collection(this.collectionName, ref => ref.where('clicked', '==', false))
    .valueChanges().pipe(map((documents: DocumentData[]) => documents.length));

  markRead = (notificationUid: string) => this.db.collection(this.collectionUsersName).doc(this.fireAuth.lotteryUser.uid)
    .collection(this.collectionName).doc(notificationUid).update({clicked: true});

  markAllRead = () => this.db.collection(this.collectionUsersName).doc(this.fireAuth.lotteryUser.uid)
    .collection(this.collectionName, ref => ref.where('clicked', '==', false))
    .get().pipe(map((snapshot: QuerySnapshot<Notification>) => {
      const batch = this.db.firestore.batch();
      snapshot.docs.forEach(document => {
        batch.update(document.ref, {clicked: true});
      });
      return batch.commit();
    }));

}
