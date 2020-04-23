import {DocumentReference} from "@angular/fire/firestore";

export class LotteryUser {
    public uid: string;
    public email: string;
    public displayName: string;
    public photoURL: string;
    public fcmTokens?: any;
    public boardsPlayed: number;
    public firstPlaces: number;
    public secondPlaces: number;
    public thirdPlaces: number;
    public otherPlaces: number;
    public friendsRef: DocumentReference[];
    public friends?: LotteryUser[];
    public online?: boolean;
    public creationDate: number;
}
