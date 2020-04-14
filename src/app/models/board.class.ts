import {firestore} from 'firebase/app';

export class Board {
    public uid: string;
    public title: string;
    public status: number;
    public currentCard: number;
    public currentDeck: number[];
    public creationDate: Date | firestore.Timestamp;
    public timeLapse: number;
    public winStrategy: number;
    public photoURL: string;

    constructor(title: string) {
        this.title = title;
        this.status = 0;
        this.currentCard = -1;
        this.currentDeck = [];
        this.timeLapse = 3;
        this.winStrategy = 0;
        this.photoURL = `assets/img/lottery/${ Math.floor(Math.random() * 53) }.jpg`
    }
}
