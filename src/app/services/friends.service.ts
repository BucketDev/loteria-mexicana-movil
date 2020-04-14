import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {
  Action,
  AngularFirestore,
  DocumentChangeAction,
  DocumentData, DocumentReference, DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {Board} from '../models/board.class';
import {LotteryUser} from '../models/lottery-user.class';
import {FireAuthService} from './security/fire-auth.service';
import {FriendLotteryUser} from "../models/friend-lottery-user.class";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private collectionUsersName = '/users';
  private collectionName = '/friends';

  constructor(private db: AngularFirestore,
              private auth: FireAuthService) { }

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
