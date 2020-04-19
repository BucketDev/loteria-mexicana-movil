import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardPageRoutingModule } from './board-routing.module';

import { BoardPage } from './board.page';
import {ComponentsModule} from '../../components/components.module';
import {BoardSettingsPageModule} from '../modal/board-settings/board-settings.module';
import {WinnersPageModule} from '../modal/winners/winners.module';
import {PlayersPageModule} from './players/players.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardPageRoutingModule,
    ComponentsModule,
    BoardSettingsPageModule,
    WinnersPageModule,
    PlayersPageModule
  ],
  declarations: [BoardPage]
})
export class BoardPageModule {}
