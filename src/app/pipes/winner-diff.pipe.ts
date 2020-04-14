import { Pipe, PipeTransform } from '@angular/core';
import {Winner} from '../models/winner.class';
import {firestore} from 'firebase/app';

@Pipe({
  name: 'winnerDiff'
})
export class WinnerDiffPipe implements PipeTransform {

  transform(compare: Date, winners: Winner[]): any {
    const milliseconds = Math.abs((winners[0].creationDate as Date).getTime() - compare.getTime());
    if (milliseconds === 0) {
      return '';
    } else {
      return `+${milliseconds / 1000} sec`;
    }
  }

}
