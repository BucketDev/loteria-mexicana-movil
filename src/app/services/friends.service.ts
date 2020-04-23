import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {LotteryUser} from '../models/lottery-user.class';
import {FireAuthService} from './security/fire-auth.service';
import {FriendLotteryUser} from "../models/friend-lottery-user.class";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private collectionUsersName = '/users';

  constructor(private db: AngularFirestore,
              private auth: FireAuthService) { }

  find = () => this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid).valueChanges()
    .pipe(map((document: DocumentData) => ({...document, uid: document.id})))

  addFriend = (user: FriendLotteryUser) => {
    const friendRef = this.db.collection(this.collectionUsersName).doc(user.uid).ref;
    return this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
      .update({friendsRef: [...this.auth.lotteryUser.friendsRef, friendRef]})
  }

  deleteFriend = (user: LotteryUser) => {
    const friendsRef = this.auth.lotteryUser.friendsRef.filter(friendRef => friendRef.id !== user.uid);
    return this.db.collection(this.collectionUsersName).doc(this.auth.lotteryUser.uid)
      .update({friendsRef})
  }
}
