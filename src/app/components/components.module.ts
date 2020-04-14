import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {PipesModule} from '../pipes/pipes.module';
import {HistorySlidesComponent} from './history-slides/history-slides.component';
import {BoardComponent} from './board/board.component';
import {FriendsComponent} from './friends/friends.component';
import {EmptyRecordsModule} from "./shared/empty-records/empty-records.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    PipesModule,
    EmptyRecordsModule
  ],
  declarations: [
    HistorySlidesComponent,
    BoardComponent,
    FriendsComponent
  ],
  exports: [
    HistorySlidesComponent,
    BoardComponent,
    FriendsComponent
  ]
})
export class ComponentsModule { }
