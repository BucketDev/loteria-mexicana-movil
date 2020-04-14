import {LotteryUser} from './lottery-user.class';
import {firestore} from "firebase/app";

export class Winner {
  public uid: string;
  public email: string;
  public displayName: string;
  public photoURL: string;
  public creationDate: Date | firestore.Timestamp;

  constructor(user: LotteryUser) {
    this.uid = user.uid;
    this.email = user.email;
    this.displayName = user.displayName;
    this.photoURL = user.photoURL;
    this.creationDate = new Date();
  }
}
