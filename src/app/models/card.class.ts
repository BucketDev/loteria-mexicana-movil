export class Card {

  public index: number;
  public photoURL: string;
  public soundURL: string;
  public selected: boolean;

  constructor(index: number) {
    this.index = index;
    this.photoURL = `assets/img/lottery/${index + 1}.jpg`;
    this.soundURL = `assets/sounds/${index + 1}.mp3`;
    this.selected = false;
  }

}
