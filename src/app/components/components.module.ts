import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from './menu/menu.component';
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
    MenuComponent,
    HistorySlidesComponent,
    BoardComponent,
    FriendsComponent
  ],
  exports: [
    MenuComponent,
    HistorySlidesComponent,
    BoardComponent,
    FriendsComponent
  ]
})
export class ComponentsModule { }
