import { Pipe, PipeTransform } from '@angular/core';
import {Card} from "../models/card.class";

@Pipe({
  name: 'lastElements', pure: false
})
export class LastElementsPipe implements PipeTransform {

  transform(cards: Card[], elements: number): Card[] {
    return cards.slice(Math.max(cards.length - elements, 0));
  }

}
