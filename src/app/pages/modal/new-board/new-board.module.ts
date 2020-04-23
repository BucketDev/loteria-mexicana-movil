import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewBoardPage } from './new-board.page';
import {FriendsModule} from "../../../components/friends/friends.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FriendsModule
  ],
  declarations: [
      NewBoardPage
  ],
  entryComponents: [
      NewBoardPage
  ]
})
export class NewBoardPageModule {}
