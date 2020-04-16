import {firestore} from "firebase/app";

export class Message {
  uid?: string;
  userUid: string;
  text: string;
  displayName: string;
  creationDate: Date | firestore.Timestamp;
}