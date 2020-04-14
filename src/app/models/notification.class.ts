import {firestore} from "firebase/app";

export class Notification {
  uid?: string;
  photoURL: string;
  pre: string;
  message: string;
  post?: string;
  creationDate: Date | firestore.Timestamp;
  clicked: boolean;
  actionURL: string;
}