import { Injectable } from '@angular/core';
import {Card} from '../models/card.class';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  cards: Card[] = [];

  constructor() {
    this.cards = this.generateDeck();
  }

  generateDeck = () => {
    const cards: Card[] = [];
    for (let idx = 0; idx < 54; idx++) {
      const card: Card = new Card(idx);
      cards.push(card);
    }
    return cards;
  }

  clearCards = () => this.cards.forEach(card => card.selected = false);

  generateCurrentDeck = () => this.shuffleDeck().map((card: Card) => card.index);

  generateCurrentBoard = () => this.shuffleDeck().splice(0, 16);

  shuffleDeck = () => {
    const array = [...this.cards];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


}
