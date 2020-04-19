import {firestore} from 'firebase/app';
import {BoardStatus} from "./board-status.enum";

export class Board {
    public uid: string;
    public title: string;
    public status: BoardStatus;
    public currentDeck: number[];
    public creationDate: Date | firestore.Timestamp;
    public timeLapse: number;
    public winStrategy: number;
    public photoURL: string;

    constructor(title: string) {
        this.title = title;
        this.status = BoardStatus.NEW;
        this.currentDeck = [];
        this.timeLapse = 3;
        this.winStrategy = 0;
        this.photoURL = `assets/img/lottery/${ Math.floor(Math.random() * 53) }.jpg`
    }
}
