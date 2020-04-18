import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {FireAuthService} from './security/fire-auth.service';
import {map} from 'rxjs/operators';
import {LotteryUser} from '../models/lottery-user.class';
import {FriendLotteryUser} from "../models/friend-lottery-user.class";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private collectionName = '/users';

  constructor(private db: AngularFirestore,
              private auth: FireAuthService) { }

  find = () => this.db.collection(this.collectionName).doc(this.auth.lotteryUser.uid).snapshotChanges()
    .pipe(map((action) => {
      const user: LotteryUser = action.payload.data() as LotteryUser;
      return {...user, uid: action.payload.id};
    }))

  updateFCMToken = (token: {}) => this.db.collection(this.collectionName).doc(this.auth.lotteryUser.uid).update({fcmTokens: token});

  findUsersByDisplayNameAndEmail = (text: string) =>
    this.db.collection(this.collectionName).get().pipe(map((snapshot: QuerySnapshot<DocumentData>): FriendLotteryUser[] =>
        snapshot.docs.map((document: QueryDocumentSnapshot<FriendLotteryUser>) => {
          const user: FriendLotteryUser = document.data();
          return {uid: document.id, ...user};
        }).filter((user: FriendLotteryUser) => (user.displayName && user.displayName.toLocaleLowerCase().includes(text)) ||
          (user.email && user.email.toLocaleLowerCase().includes(text)))
      ))

  update = (uid: string, user: {displayName?: string | null, photoURL?: string | null}) =>
    this.db.collection(this.collectionName).doc(uid).update(user)

  findByUid = (uid: string) => this.db.collection(this.collectionName).doc(uid).valueChanges()
    .pipe(map((document) => ({...document, uid})))
}
