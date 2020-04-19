import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayersPage } from './players.page';
import {PlayersPageRoutingModule} from "./players-routing.module";
import {AddFriendPageModule} from "../../modal/add-friend/add-friend.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayersPageRoutingModule,
    AddFriendPageModule
  ],
  declarations: [PlayersPage],
  exports: [PlayersPage]
})
export class PlayersPageModule {}
