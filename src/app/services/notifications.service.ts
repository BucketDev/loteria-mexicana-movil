import { Injectable } from '@angular/core';
import {AngularFirestore, QueryDocumentSnapshot, QuerySnapshot} from "@angular/fire/firestore";
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
    .collection(this.collectionName, ref => ref.limit(4).orderBy('creationDate', 'desc'))
    .get().pipe(map((snapshot: QuerySnapshot<Notification>) => snapshot.docs
      .map((document: QueryDocumentSnapshot<Notification>) => {
        const notification: Notification = document.data();
        return {...notification, uid: document.id};
    })))

}
