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

  find = () => this.db.collection(this.collectionName).doc(this.auth.lotteryUser.uid).get()
    .pipe(map((snapshot: DocumentSnapshot<LotteryUser>) => ({...snapshot.data(), uid: snapshot.id})))

  updateFCMToken = (token: {}) => this.db.collection(this.collectionName).doc(this.auth.lotteryUser.uid).update({fcmTokens: token});

  findUsersByDisplayNameAndEmail = (filter: string) =>
    this.db.collection(this.collectionName).get().pipe(map((snapshot: QuerySnapshot<DocumentData>): FriendLotteryUser[] =>
        snapshot.docs.map((document: QueryDocumentSnapshot<FriendLotteryUser>) => {
          const user: FriendLotteryUser = document.data();
          return {uid: document.id, ...user};
        }).filter((user: FriendLotteryUser) => {
          if (user.displayName && user.email) {
            const replacedFilter = filter.toLocaleLowerCase()
              .replace(/[áàäâ]/g, 'a')
              .replace(/[éèëê]/g, 'e')
              .replace(/[íìïî]/g, 'i')
              .replace(/[óòöô]/g, 'o')
              .replace(/[úùüû]/g, 'u');
            const replacedName = user.displayName
              .replace(/[áàäâ]/g, 'a')
              .replace(/[éèëê]/g, 'e')
              .replace(/[íìïî]/g, 'i')
              .replace(/[óòöô]/g, 'o')
              .replace(/[úùüû]/g, 'u')
              .toLocaleLowerCase();
            const tokenFilter = replacedFilter.split(' ');
            return tokenFilter.some(filter => replacedName.includes(filter)) ||
              tokenFilter.some(filter => user.email.toLocaleLowerCase().split('@')[0].includes(filter))
          } else {
            return false;
          }
        })
    ));


  update = (uid: string, user: {displayName?: string | null, photoURL?: string | null}) =>
    this.db.collection(this.collectionName).doc(uid).update(user)

  findByUid = (uid: string) => this.db.collection(this.collectionName).doc(uid).valueChanges()
    .pipe(map((document) => ({...document, uid})))
}
